\c nc_news_test

-- SELECT * FROM articles;
-- SELECT * FROM comments;
-- SELECT * FROM topics;
-- SELECT * FROM users;

-- SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id
-- FROM comments 
-- LEFT OUTER JOIN articles
-- ON comments.article_id = articles.article_id
-- GROUP BY comments.comment_id
-- ORDER BY comments.created_at
-- DESC;  

SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
  COUNT (comments.comment_id) 
  AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at
  DESC;