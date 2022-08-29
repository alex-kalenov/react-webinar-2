import React, { useCallback, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import {
  useStore as useStoreRedux,
  useSelector as useSelectorRedux,
  shallowEqual,
} from "react-redux";
import useInit from "../../hooks/use-init";
import "./style.css";
import Comment from "../comment";
import CommentCreate from "../comment-create";
import { Link } from "react-router-dom";
import actionsComments from "../../store-redux/comments/actions";

function CommentSection({ isLoggedIn, articleId }) {
  const [rerenderSwitch, setRerenderSwitch] = useState(false);
  const storeRedux = useStoreRedux();

  useInit(async () => {
    storeRedux.dispatch(actionsComments.load(articleId));
  }, [articleId, rerenderSwitch]);

  const commentsSlice = useSelectorRedux(
    (state) => ({
      list: state.comments.data,
      count: state.comments.count,
      waiting: state.comments.waiting,
    }),
    shallowEqual
  );

  const createComment = useCallback(
    async ({ text, parent_id, parent_type }) => {
      storeRedux.dispatch(
        actionsComments.create({
          text,
          parent: { _id: parent_id, _type: parent_type },
        })
      );
      setRerenderSwitch((state) => !state);
    },
    []
  );

  const cn = bem("CommentSection");

  const comments = commentsSlice.list.map((item) => (
    <Comment
      item={item}
      key={item._id}
      isLoggedIn={isLoggedIn}
      onReply={createComment}
    />
  ));
  const create_comment_form = isLoggedIn ? (
    <CommentCreate onCreate={createComment} articleId={articleId} />
  ) : (
    <div style={{ marginTop: "30px" }}>
      <Link to="/login">Войдите</Link>, чтобы иметь возможность комментировать
    </div>
  );

  return !commentsSlice.waiting ? (
    <div className={cn()}>
      <h2 className={cn("header")}>Комментарии ({commentsSlice.count})</h2>
      {!!commentsSlice.list.length && comments}
      {create_comment_form}
    </div>
  ) : (
    <></>
  );
}

export default CommentSection;
