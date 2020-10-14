import React from 'react';
import moment from 'moment';
import Table from 'react-bootstrap/Table';

export default ({ accruals }) => (
  <>
    {!accruals.length && (
      <>Начислений нет</>
    )}
    {!!accruals.length && (
      <Table className="mt-4" striped bordered hover>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Задача</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {accruals.map(accrual => (
            <tr>
              <td>{moment(accrual.createdAt).format('HH:mm DD.MM.YY')}</td>
              <td>{accrual.task && accrual.task.title}</td>
              <td>{accrual.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </>
);
