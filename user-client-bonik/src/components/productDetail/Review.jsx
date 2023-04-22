import React, { memo } from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import HalfRatingRead from '../../common/rating/HalfRatingRead';
import Card from 'antd/es/card/Card';
import Moment from 'react-moment';
import 'moment-timezone';
const Review = ({ listReview, handleClick, loading }) => {
    return (
        <Card loading={loading}>
            <Comment.Group>
                {listReview.length !== 0
                    ? listReview.map((item, index) => {
                          return (
                              <Comment key={index}>
                                  <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                                  <Comment.Content>
                                      <Comment.Author>
                                          {item.user_fullName}
                                      </Comment.Author>
                                      <Comment.Metadata>
                                          <div>{item.variant_name}</div>
                                          <div>{item.variant_color}</div>
                                          <Moment fromNow>
                                              {item.created_date}
                                          </Moment>
                                      </Comment.Metadata>
                                      <Comment.Text>
                                          <HalfRatingRead value={item.point} />
                                      </Comment.Text>
                                      <Comment.Text>
                                          {item.content}
                                      </Comment.Text>
                                  </Comment.Content>
                              </Comment>
                          );
                      })
                    : 'Chưa có đánh giá nào'}
            </Comment.Group>
        </Card>
    );
};
export default memo(Review);
