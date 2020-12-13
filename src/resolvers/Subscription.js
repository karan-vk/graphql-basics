const Subscription = {
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let count = 0;
            setInterval(() => {
                count++;
                pubsub.publish("count", {
                    count: count,
                });
            }, 1000);
            return pubsub.asyncIterator(["count"]);
        },
    },

    comment: {
        subscribe(_, { postId }, { pubsub, db }, info) {
            console.log(j);
            const post = db.posts.find(
                (post) => postId === post.id && post.published
            );
            if (!post) {
                throw new Error("Post not found");
            }

            return pubsub.asyncIterator(`comment ${postId}`);
        },
    },
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator("post");
        },
    },
};

export default Subscription;