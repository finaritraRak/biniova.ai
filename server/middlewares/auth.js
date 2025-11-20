import { clerkClient } from "@clerk/express";

// Middleware to check userId and hasPremiumPlan

export const auth = async (req, res, next)=>{
    try {
        const {userId, has} = await req.auth();
        const hasPremiumPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);
        const privateMetadata = user.privateMetadata || {};

        // On prépare tous les compteurs d'usage free par feature
        req.free_usage = {
            article: privateMetadata.free_usage_article || 0,
            blogTitle: privateMetadata.free_usage_blog_title || 0,
            imageGenerate: privateMetadata.free_usage_image_generate || 0,
            removeBg: privateMetadata.free_usage_remove_bg || 0,
            removeObject: privateMetadata.free_usage_remove_object || 0,
            resumeReview: privateMetadata.free_usage_resume_review || 0,
        };

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
