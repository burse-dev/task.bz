import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ReportCard from '../ReportCard';

export default ({
  group,
  handleClickApprove,
  handleClickDecline,
  handleClickRework,
  handleClickCheckbox,
  isChecked,
}) => {
  const [groupIsOpen, setGroupIsOpen] = useState(false);
  const handleClickOpen = () => {
    setGroupIsOpen(true);
  };

  const handleClickHide = () => {
    setGroupIsOpen(false);
  };

  const reportsCount = group.reports.length;

  const reportArr = groupIsOpen ? group.reports : [group.reports[0]];

  return (
    <div>
      {reportArr.map(report => (
        <ReportCard
          key={report.id}
          handleClickApprove={handleClickApprove(report.id)}
          handleClickDecline={handleClickDecline(report.id)}
          handleClickRework={handleClickRework(report.id)}
          handleClickCheckbox={handleClickCheckbox(report.id)}
          isChecked={isChecked(report.id)}
          createdAt={report.createdAt}
          screenshot={report.screenshot}
          files={report.files}
          report={report.report}
          reply={report.reply}
          userName={report.user.login}
          statusId={report.status}
        />
      ))}

      {reportsCount > 1 && (
        <div className="text-center pt-1 pb-2">
          {!groupIsOpen && (
            <Button onClick={handleClickOpen} variant="outline-dark" size="sm">
              Предыдущие отчеты (
              { reportsCount - 1 }
              )
            </Button>
          )}
          {groupIsOpen && (
            <Button onClick={handleClickHide} variant="outline-dark" size="sm">
              Скрыть отчеты (
              { reportsCount - 1 }
              )
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
