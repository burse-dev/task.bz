import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import Tooltip from '../../generic/Tooltip';
import Price from '../../generic/Price';
import categories from '../../../constant/category';
import TaskStatusBadge from '../../generic/TaskStatusBadge';
import SmallButton from '../../generic/Buttons/SmallButton';
import editIcon from '../../img/editIcon.svg';
import crownIcon from '../../img/crownIcon.svg';
import removeFromPackIcon from '../../img/removeFromPackIcon.svg';
import crownIconActive from '../../img/crownIcon-active.svg';
import { REPEATED_TYPE_ID } from '../../../constant/taskExecutionType';
import { IN_WORK_TASK_STATUS_ID } from '../../../constant/taskStatus';

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px;
  border: 1px solid #dfdfdf;
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
  && {
    ${({ inPackage }) => inPackage && 'box-shadow: none; background: #edfdff; margin-top: -1px!important;'} 
  }
`;

const Col = styled.div`
  display: flex;
  justify-content: center;
`;

const RemoveIcon = styled.img`
  width: 16px;
`;

const NameCol = styled.div`
  width: 25%;
`;

const PriceCol = styled(Col)`
  width: 10%;
`;

const StatusCol = styled(Col)`
  width: 20%;
`;

const DoneCol = styled(Col)`
  width: 15%;
`;

const InWorkCol = styled(Col)`
  width: 15%;
`;

const EditCol = styled.div`
  display: flex;
  width: 5%;
  text-align: right;
`;

const Title = styled.div`
  font-size: 16px;
  color: #333;
  &:hover {
    text-decoration: none;
  }
`;

const Category = styled.div`
  padding-right: 10px;
  font-size: 12px;
  color: #888;
`;

const getCategoryById = id => categories.find(category => category.id === id);

export default ({
  id,
  title,
  category,
  price,
  statusId,
  executionType,
  inWorkCount,
  pendingCount,
  successCount,
  totalCount,
  inPriority,
  setPriority,
  inPackage,
  handleClickCheckbox,
  isChecked,
  handleClickDeleteFromPack,
}) => (
  <StyledLink
    inPackage={inPackage}
    to={`/tasks-list/check/${id}`}
    className="mt-1 rounded"
  >
    <NameCol>
      <Title
        className="d-flex align-items-center"
      >
        <div className="pr-2">
          {title}
        </div>
      </Title>
      <div className="d-flex">
        <Category>
          {getCategoryById(category).name}
        </Category>
        <Category>
          {executionType === REPEATED_TYPE_ID ? 'Многоразовое' : 'Одноразовое' }
        </Category>
      </div>
    </NameCol>
    <PriceCol>
      <Price price={price} />
    </PriceCol>
    <StatusCol>
      <TaskStatusBadge statusId={statusId} />
    </StatusCol>
    <DoneCol>
      <Tooltip
        content="Выполнено"
      >
        {successCount}
      </Tooltip>
      {totalCount && (
        <>
          {' / '}
          <Tooltip
            content="Общее число"
          >
            {totalCount}
          </Tooltip>
        </>
      )}
    </DoneCol>
    <InWorkCol>
      <Tooltip
        content="На проверке"
      >
        {pendingCount}
      </Tooltip>
      {' - '}
      <Tooltip
        content="В работе"
      >
        {inWorkCount}
      </Tooltip>
    </InWorkCol>
    <EditCol>
      <Link to={`/tasks-list/edit/${id}`}>
        <SmallButton icon={editIcon} />
      </Link>

      {!inPackage && (
        <SmallButton
          icon={inPriority ? crownIconActive : crownIcon}
          onClick={setPriority(id)}
        />
      )}
    </EditCol>

    {!inPriority && !inPackage && statusId === IN_WORK_TASK_STATUS_ID && <Form.Check onClick={handleClickCheckbox(id)} checked={isChecked} type="checkbox" />}

    {inPackage && <RemoveIcon src={removeFromPackIcon} onClick={handleClickDeleteFromPack(id)} alt="Удалить из пакета" />}
  </StyledLink>
);
