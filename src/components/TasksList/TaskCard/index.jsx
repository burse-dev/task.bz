import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Tooltip from '../../generic/Tooltip';
import Price from '../../generic/Price';
import categories from '../../../constant/category';
import TaskStatusBadge from '../../generic/TaskStatusBadge';
import SmallButton from '../../generic/Buttons/SmallButton';
import editIcon from '../../img/editIcon.svg';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
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

const Col = styled.div`
  display: flex;
  justify-content: center;
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
  width: 15%;
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
  inWorkCount,
  pendingCount,
  successCount,
  totalCount,
}) => (
  <Wrapper
    as={Link}
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
      <Category>
        Категория:
        {' '}
        {getCategoryById(category).name}
      </Category>
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
    </EditCol>
  </Wrapper>
);
