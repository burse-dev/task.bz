import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Form, Button as DefaultButton } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';
import SmallButton from '../../../generic/Buttons/SmallButton';
import checkIcon from '../../../img/checkedIcon.svg';
import editIcon from '../../../img/editIcon.svg';
import closeIcon from '../../../img/closeIcon.svg';
import TaskExecutionStatusBadge from '../../../generic/TaskExecutionStatusBadge';
import FormControl from '../../../generic/Form/FormControlRedux';
import { PENDING_STATUS_ID } from '../../../../constant/taskExecutionStatus';

const Wrapper = styled.div`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(0,0,0,.125);
  box-shadow: 0 0 4px 0 rgba(1,1,1,0.1);
  cursor: pointer;
  transition: .2s;
  color: #333;
  &:hover {
    color: #333;   
  }
  &:hover {
    background: #f7f7f7;   
  }
`;

const Img = styled.img`
  width: 100px;
  margin: 4px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  min-width: 150px;
`;

const Button = styled(SmallButton)`
  margin: 0 2px;
`;

const CreatedAt = styled.div`
  padding-top: 5px;
  color: #888;
  font-size: 14px;
`;

const ReplyForm = ({ handleSubmit, handleClickCancelEditing }) => (
  <Form onSubmit={handleSubmit} className="p-3">
    <Form.Group>
      <Form.Label>Отправить задание на доработку</Form.Label>
      <Field
        name="reply"
        placeholder="Опишите то, что следует исправить исполнителю"
        as="textarea"
        rows="3"
        component={FormControl}
      />
      <Form.Text className="text-muted">
        До 1000 символов
      </Form.Text>
    </Form.Group>
    <DefaultButton size="sm" type="submit" variant="outline-success">Отправить</DefaultButton>
    &nbsp;&nbsp;
    <DefaultButton size="sm" variant="outline-secondary" onClick={() => handleClickCancelEditing(false)}>Отмена</DefaultButton>
  </Form>
);

const ReduxReplyForm = reduxForm({
  form: 'replyReportForm',
})(ReplyForm);

export default ({
  userName,
  report,
  reply,
  statusId,
  // screenshot,
  files,
  isChecked,
  createdAt,
  handleClickCheckbox,
  handleClickRework,
  handleClickDecline,
  handleClickApprove,
}) => {
  const [formIsOpen, setFormIsOpen] = useState(false);

  const handleClickEdit = () => {
    setFormIsOpen(true);
  };

  const handleSubmit = (values) => {
    handleClickRework(values);
    setFormIsOpen(false);
  };

  return (
    <Wrapper
      className="mt-1 rounded"
    >
      <Content>
        <div className="mr-3 ml-3">
          <Form.Check type="checkbox" onChange={handleClickCheckbox} checked={isChecked} />
        </div>
        <UserName>
          <div>
            {userName}
          </div>
          <TaskExecutionStatusBadge statusId={statusId} />
          <div>
            <CreatedAt>
              {moment(createdAt).format('HH:mm DD.MM.YY')}
            </CreatedAt>
          </div>
        </UserName>
        <div className="mr-auto">
          <div>{report}</div>
          {reply && (
            <>
              Комментарий:
              <div>
                {reply}
              </div>
            </>
          )}
        </div>
        <div className="mr-4 ml-4 d-flex align-items-center">
          {files.map(file => (
            // eslint-disable-next-line react/jsx-no-target-blank
            <a target="_blank" href={file.url}>
              <Img src={file.url} />
            </a>
          ))}
        </div>
        <div className="mr-2 ml-2 d-flex">
          <Button
            icon={checkIcon}
            onClick={handleClickApprove}
            disabled={statusId !== PENDING_STATUS_ID}
          />
          <Button
            icon={editIcon}
            onClick={handleClickEdit}
            disabled={statusId !== PENDING_STATUS_ID}
          />
          <Button
            icon={closeIcon}
            onClick={handleClickDecline}
            disabled={statusId !== PENDING_STATUS_ID}
          />
        </div>
      </Content>
      {formIsOpen && (
        <ReduxReplyForm handleClickCancelEditing={setFormIsOpen} onSubmit={handleSubmit} />
      )}
    </Wrapper>
  );
};
