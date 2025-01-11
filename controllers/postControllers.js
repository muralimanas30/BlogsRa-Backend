/* -------------------------------------------------------------------------- */
/*                THE MAIN FUNCTIONALITY LIES HERE, COMING SOON               */
/* -------------------------------------------------------------------------- */

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../error/CustomError');
const Post = require('../models/Post');
const PostList = require('../models/PostList');
const cloudinary = require('../utility/cloudinary');
const AccountStatus = require('../models/AccountStatus');
const LikedPostList = require('../models/LikedPostList');

const createPost = async (req, res, next) => {
    try {
        const { userId, email } = req.user;
        const { accountId, title, content, tags } = req.body;
        const file = req.file;

        // Validate required fields
        if (!title && !file) {
            throw new CustomError('Content or file is missing', StatusCodes.BAD_REQUEST);
        }
        const account = await AccountStatus.findById(accountId);
        if (!account) {
            throw new CustomError("Account not found", StatusCodes.NOT_FOUND);
        }
        let postData = {
            accountId,
            profilePicture: account.profilePicture,
            name: account.name,
            userId,
            title,
            content,
            likes: 0,
            tags: tags ? tags.split(",").map(e => e.trim().toLowerCase()) : [], // Default to an empty array if no tags
            createdAt: new Date(),
            updatedAt: new Date() // Fixing the typo here
        };

        // Handle file upload if provided
        if (file) {
            console.log("image uploading")
            try {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: `posts/${email}` // Folder specific to the user's email
                });

                postData.imageUrl = uploadResult.secure_url;
            } catch (cloudinaryError) {
                throw new CustomError(cloudinaryError.message || 'Error Uploading to Cloudinary', StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }

        // Create the post in the database
        const newPost = await Post.create(postData);

        // Update the user's post list with the new post
        const postList = await PostList.findOne({ accountId });

        if (postList) {
            postList.posts.push(newPost._id);
            await postList.save();
        } else {
            const newPostList = await PostList.create({
                accountId,
                posts: [newPost._id]
            });
            await newPostList.save();
        }
        await updateBlogStats(accountId, true);
        // Respond with success
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: 'Post created successfully!',
            post: newPost,
        });
    } catch (error) {
        // Handle errors gracefully by passing to custom error handler
        next(error); // Ensure that your error handler (next) is available in your app
    }
};



const getPosts = async (req, res, next) => {
    try {
        const { accountId, tags, page = 1, limit = 10, liked = false, trending = false } = req.query;

        let postList;
        let filter = {};  // Default filter, will be modified based on conditions

        // If accountId is provided, handle it as normal (liked or not)
        if (accountId) {
            if (liked) {
                postList = await LikedPostList.findOne({ accountId });
            } else {
                postList = await PostList.findOne({ accountId });
            }

            if (!postList) {
                return res.status(StatusCodes.OK).json({
                    message: `No ${liked === true ? "liked " : ""}posts found for this user.`,
                    posts: [],
                    pagination: {
                        currentPage: page,
                        totalPosts: 0,
                        totalPages: 0,
                        limit,
                    },
                });
            }

            // Filter for the user's posts
            filter = { _id: { $in: postList.posts } };
        }

        // If tags are provided, filter posts by tags
        if (tags) {
            filter.tags = { $in: tags.split(',') };  // Split tags by commas and use MongoDB `$in` operator
        }

        // Pagination setup
        const skip = (page - 1) * limit;

        // Trending logic: sort by likes or creation date
        let sort = { createdAt: -1 }; // Default to latest posts if not trending

        if (trending === 'true') {
            // Sort by the number of likes (in descending order), then by createdAt for tie-breaking
            sort = { likes: -1, createdAt: -1 };
        }

        // Fetch posts using the filter, pagination, and sorting
        const posts = await Post.find(filter)
            .skip(skip)
            .limit(Number(limit))
            .sort(sort)
            .exec();

        if (!posts.length) {
            return res.status(StatusCodes.OK).json({
                message: `Oops, you've reached the end of ${liked === true ? "liked " : ""}posts`,
                success: false,
                posts: [],
                pagination: {},
            });
        }

        // Calculate the total number of posts for the filter
        const totalPosts = await Post.countDocuments(filter);
        const totalPages = Math.ceil(totalPosts / limit);

        // Respond with the posts and pagination information
        res.status(StatusCodes.OK).json({
            message: `${liked === true ? "Liked " : ""}Posts fetched successfully`,
            success: true,
            posts,
            pagination: {
                currentPage: page,
                totalPosts,
                totalPages,
                limit,
            },
        });
    } catch (error) {
        next(error);  // Pass the error to the global error handler
    }
};


const updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;  // Get postId from request parameters
        const { liked, accountId } = req.body;  // Get the 'liked' boolean and accountId from the request body

        // Validate accountId
        if (!accountId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Account ID is required.',
            });
        }

        // Step 1: Fetch the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            throw new CustomError('Post not found', StatusCodes.NOT_FOUND);
        }

        // Step 2: Fetch the likedPostList for the account once
        const likedPostList = await LikedPostList.findOne({ accountId });

        // If liked is true (user is liking the post)
        if (liked) {
            // If likedPostList doesn't exist, create a new list and add the postId
            if (!likedPostList) {
                const newLikedPostList = new LikedPostList({ accountId, posts: [postId] });
                await newLikedPostList.save();
            } else {
                // Check if the account has already liked the post
                if (!likedPostList.posts.includes(postId)) {
                    // Add the postId to the liked list if it's not already there
                    likedPostList.posts.push(postId);
                    await likedPostList.save();

                    // Increment the likes count on the post
                    post.likes += 1;
                } else {
                    return res.status(StatusCodes.OK).json({
                        message: 'Post already liked',
                        post,
                        success: false,
                    });
                }
            }
        } else {  // If liked is false (user is disliking the post)
            if (likedPostList) {

                // If the postId exists in the likedPostList, remove it (dislike action)
                likedPostList.posts = likedPostList.posts.filter(id => id.toString() !== postId.toString());
                await likedPostList.save();

                // Decrement the likes count on the post, ensuring it doesn't go below 0
                post.likes = Math.max(0, post.likes - 1);
            }
        }

        // Step 3: Save the updated post
        await post.save();

        // Step 4: Return the updated post as a response
        res.status(StatusCodes.OK).json({
            message: 'Post updated successfully',
            post,
            success: true,
        });
    } catch (error) {
        next(error);  // Pass the error to the global error handler
    }
};



const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;  // Get postId from request parameters
        console.log(postId)
        const { accountId } = req.body
        // Step 1: Find the post
        const post = await Post.findById(postId);
        if (!post) {
            throw new CustomError('Post not found', StatusCodes.NOT_FOUND);
        }

        // Step 2: Check if the user is the owner of the post
        if (post.accountId.toString() !== accountId.toString()) {
            throw new CustomError('You do not have permission to delete this post', StatusCodes.FORBIDDEN);
        }

        // Step 3: Remove the post from the PostList if it exists
        const postList = await PostList.findOne({ accountId });
        if (postList) {
            // Remove the postId from the posts array
            postList.posts = postList.posts.filter(id => id.toString() !== postId.toString());
            await postList.save();
        }

        // Step 4: Delete the post
        await Post.findByIdAndDelete(postId);
        await LikedPostList.updateMany(
            { posts: postId }, // Find documents where posts array contains postId
            { $pull: { posts: postId } } // Remove postId from the posts array
        );
        await updateBlogStats(accountId, false);
        // Step 5: Respond with a success message
        res.status(StatusCodes.OK).json({
            message: 'Post deleted successfully',
            success: true,
        });
    } catch (error) {
        next(error);  // Pass error to global error handler
    }
};

const updateBlogStats = async (accountId, increment = true) => {
    try {
        // Step 1: Find the Account by accountId
        console.log(accountId)
        const account = await AccountStatus.findOne({ _id: accountId });
        if (!account) {
            throw new Error('Account not found');
        }

        // Step 2: Update the 'posts' count in BlogStats
        if (increment) {
            // Increment the number of posts if a post is being created
            account.blogStats.posts += 1;
        } else {
            // Decrement the number of posts if a post is being deleted
            account.blogStats.posts = Math.max(0, account.blogStats.posts - 1);  // Ensure the count doesn't go below 0
        }

        // Step 3: Save the updated Account document
        await account.save();
        // console.log('BlogStats updated successfully');
    } catch (error) {
        console.error('Error updating BlogStats:', error.message);
        throw error;
    }
};

const deletePostWithoutRequest = async (postId, accountId) => {
    try {
        // Step 1: Find the post
        console.log("post id")
        const post = await Post.findById(postId);
        if (!post) {
            console.error(`Post with ID: ${postId} not found`);
            return;
        }

        // Step 2: Check if the user is the owner of the post
        if (post.accountId.toString() !== accountId.toString()) {
            console.error(`User does not have permission to delete post with ID: ${postId}`);
            return;
        }

        // Step 3: Remove the post from the PostList if it exists
        const postList = await PostList.findOne({ accountId });
        if (postList) {
            postList.posts = postList.posts.filter(id => id.toString() !== postId.toString());
            await postList.save();
        }

        // Step 4: Delete the post
        await Post.findByIdAndDelete(postId);
        await LikedPostList.updateMany(
            { posts: postId },
            { $pull: { posts: postId } }
        );

        console.log(`Post with ID: ${postId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting post with ID: ${postId}`, error);
    }
};

const updateLikedPostWithoutRequest = async (postId, accountId) => {
    try {
        // Step 1: Find the liked post list
        const likedPostList = await LikedPostList.findOne({ accountId });
        if (!likedPostList) {
            console.error(`LikedPostList not found for account: ${accountId}`);
            return;
        }

        // Step 2: If the post exists in the likedPostList, decrement the like count
        if (likedPostList.posts.includes(postId)) {
            await updatePost({ params: { postId }, body: { liked: false, accountId } });
            console.log(`Like count for post with ID: ${postId} decremented.`);
        }
    } catch (error) {
        console.error(`Error updating liked post with ID: ${postId}`, error);
    }
};

const deleteEverything = async (req, res, next) => {
    const { accountId } = req.body;

    try {
        // Check if account exists
        const account = await AccountStatus.findById(accountId);
        if (!account) {
            throw new CustomError("Account Not Found", StatusCodes.NOT_FOUND);
        }

        // Send response immediately
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "Deletion process initiated. Check logs for completion status." });
        console.log("The Delete Process BEGIN >>>>> ");

        // Run the deletion process in the background
        (async () => {
            try {
                // Fetch associated liked post list and post list
                const likedPostList = await LikedPostList.findOne({ accountId });
                const postList = await PostList.findOne({ accountId });

                // Delete posts from PostList
                if (postList) {
                    for (const postId of postList.posts) {
                        // Mock the req, res, and next for deletePost
                        const mockReq = {
                            params: { postId },
                            body: { accountId }
                        };
                        const mockRes = {
                            status: (statusCode) => ({
                                json: (data) => console.log(`Mock response: ${statusCode}`, data)
                            })
                        };
                        const mockNext = (err) => {
                            if (err) {
                                console.error(`Error deleting post with ID: ${postId}`, err);
                            }
                        };

                        // Call the original deletePost function
                        await deletePost(mockReq, mockRes, mockNext);
                    }
                    // Remove the user's post list document
                    await PostList.deleteOne({ accountId });
                }

                // Update liked posts and decrement like counts
                if (likedPostList) {
                    for (const postId of likedPostList.posts) {
                        // Mock the req, res, and next for updateLikedPost
                        const mockReq = {
                            params: { postId },
                            body: { liked: false, accountId }
                        };
                        const mockRes = {
                            status: (statusCode) => ({
                                json: (data) => console.log(`Mock response: ${statusCode}`, data)
                            })
                        };
                        const mockNext = (err) => {
                            if (err) {
                                console.error(`Error updating post with ID: ${postId}`, err);
                            }
                        };

                        // Call the original updateLikedPost function
                        await updatePost(mockReq, mockRes, mockNext);
                    }
                    // Remove the user's liked post list document
                    await LikedPostList.deleteOne({ accountId });
                }
                // Log completion
                console.log(`Post Deletion process completed for account: ${accountId}`);
            } catch (error) {
                console.error(`Error during deletion for account: ${accountId}`, error);
            }
        })();
    } catch (error) {
        next(error); // Pass error to middleware for centralized error handling
    }
};



module.exports = { createPost, getPosts, updatePost, deletePost, deleteEverything }