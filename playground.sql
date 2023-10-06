\c nc_news_test

SELECT * FROM articles;
SELECT * FROM comments;
-- SELECT * FROM topics;
SELECT * FROM users;



-- SELECT comments.body, comments.article_id
-- FROM comments
-- LEFT OUTER JOIN articles
-- ON comments.article_id = articles.article_id
-- GROUP BY comments.comment_id
-- ORDER BY comments.article_id
-- DESC;
