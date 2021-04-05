import React, { Component } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ReportGroup from './ReportGroup';
import Preloader from '../../generic/Preloader';
import checkIcon from '../../img/checkedIcon.svg';
import closeIcon from '../../img/closeIcon.svg';
import SmallButton from '../../generic/Buttons/SmallButton';
import {
  IN_WORK_STATUS_ID,
  PENDING_STATUS_ID,
  OVERDUE_STATUS_ID,
  REJECTED_STATUS_ID,
  REWORK_STATUS_ID,
  SUCCESS_STATUS_ID,
} from '../../../constant/taskExecutionStatus';

const Filter = styled.div`
  margin-bottom: 20px;
  width: 150px;
`;

const Button = styled(SmallButton)`
  margin: 0 2px;
`;

const sortReports = (reports) => {
  const result = [];
  reports.forEach((report) => {
    const groupIndex = result.findIndex(group => group.userId === report.userId);
    if (groupIndex === -1) {
      result.push({
        userId: report.userId,
        reports: [report],
      });
    } else {
      result[groupIndex].reports.push(report);
    }
  });

  return result;
};

class CheckReports extends Component {
  constructor() {
    super();

    this.state = {
      title: '',
      loading: true,
      reportGroups: [],
      // count: 0,
      areAllChecked: false,
      checkedIds: [],
      status: PENDING_STATUS_ID,
    };
  }

  async componentDidMount() {
    await this.setState({
      loading: true,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  }

  load = async () => {
    const { match: { params: { id } }, authToken } = this.props;

    const { status } = this.state;
    const query = new URLSearchParams({
      ...(status && { status }),
    });

    return fetch(`/api/reports/${id}?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': `Bearer ${authToken}`,
      },
    })
      .then(async (response) => {
        const responseData = await response.json();

        if (responseData.reports[0]) {
          const reportGroups = sortReports(responseData.reports);
          this.setState({
            title: responseData.reports[0].task.title,
            reportGroups,
          });
        } else {
          this.setState({
            reportGroups: [],
          });
        }
      });
  };

  setFilter = async (e) => {
    const status = parseInt(e.target.value, 10);

    await this.setState({
      loading: true,
      status: status || null,
    });

    await this.load();

    this.setState({
      loading: false,
    });
  };

  isChecked = (id) => {
    const { checkedIds } = this.state;

    return checkedIds.includes(id);
  };

  handleClickCheckAll = () => {
    const { reports } = this.state;
    const ids = reports ? reports.map(item => item.id) : [];
    this.setState(({ areAllChecked }) => ({
      areAllChecked: !areAllChecked,
      checkedIds: areAllChecked ? [] : ids, // для того, чтобы убрать все выбранные
    }));
  };

  handleClickCheckbox = id => () => {
    const { checkedIds } = this.state;
    // remove if exist
    const index = checkedIds.indexOf(id);
    if (index !== -1) {
      checkedIds.splice(index, 1);
    } else {
      checkedIds.push(id);
    }

    this.setState({
      checkedIds,
    });
  };

  handleClickApprove = id => () => {
    const { authToken } = this.props;
    fetch(`/api/reports/approve?ids=${id}`, {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async () => {
      await this.load();
    });
  };

  handleClickDecline = id => () => {
    const { authToken } = this.props;
    fetch(`/api/reports/decline?ids=${id}`, {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async () => {
      await this.load();
    });
  };

  handleClickRework = id => (values) => {
    const { authToken } = this.props;
    const formData = new FormData();
    formData.append('reportId', id);
    formData.append('reply', values.reply);
    fetch('/api/reports/rework', {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    }).then(async () => {
      await this.load();
    });
  };

  handleClickApproveAll = () => {
    const { checkedIds } = this.state;
    const { authToken } = this.props;

    if (!checkedIds.length) {
      return;
    }

    if (!window.confirm('Одобрить все отмеченные отчеты?')) {
      return;
    }

    fetch(`/api/reports/approve?ids=${checkedIds.toString()}`, {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async () => {
      await this.load();
      this.setState({
        checkedIds: [],
        areAllChecked: false,
      });
    });
  };

  handleClickDeclineAll = () => {
    const { checkedIds } = this.state;
    const { authToken } = this.props;

    if (!checkedIds.length) {
      return;
    }

    if (!window.confirm('Отклонить все отмеченные отчеты?')) {
      return;
    }

    fetch(`/api/reports/decline?ids=${checkedIds.toString()}`, {
      method: 'POST',
      headers: {
        'X-Authorization': `Bearer ${authToken}`,
      },
    }).then(async () => {
      await this.load();
      this.setState({
        checkedIds: [],
        areAllChecked: false,
      });
    });
  };

  render() {
    const { loading, title, areAllChecked, reportGroups, status } = this.state;
    const { authToken } = this.props;

    if (loading || !authToken) {
      return (
        <Container className="pt-3 pb-5 vh-80">
          <Preloader className="mt-5" />
        </Container>
      );
    }

    return (
      <>
        {!loading && (
          <>
            <Container>
              <div className="pt-3 pt-lg-5 pb-lg-3">
                <h2>
                  Отчеты на проверку по задаче:
                  {' '}
                  {title}
                </h2>
              </div>

              <Filter>
                <Form.Control onChange={this.setFilter} as="select" custom>
                  <option value={0}>Все отчеты</option>
                  <option selected={status === IN_WORK_STATUS_ID} value={IN_WORK_STATUS_ID}>
                    В работе
                  </option>
                  <option selected={status === PENDING_STATUS_ID} value={PENDING_STATUS_ID}>
                    На проверке
                  </option>
                  <option selected={status === OVERDUE_STATUS_ID} value={OVERDUE_STATUS_ID}>
                    Не выполнено
                  </option>
                  <option selected={status === REJECTED_STATUS_ID} value={REJECTED_STATUS_ID}>
                    Отклонено
                  </option>
                  <option selected={status === REWORK_STATUS_ID} value={REWORK_STATUS_ID}>
                    Требует доработки
                  </option>
                  <option selected={status === SUCCESS_STATUS_ID} value={SUCCESS_STATUS_ID}>
                    Принято
                  </option>
                </Form.Control>
              </Filter>
            </Container>

            {!reportGroups.length && (
              <div>
                <Container className="vh-80">
                  <div className="pt-3 pt-lg-5 pb-lg-3">
                    <h6>Отчетов нет</h6>
                  </div>
                </Container>
              </div>
            )}

            {!!reportGroups.length && (
              <>
                <Container className="vh-80">
                  <Row>
                    <Col>
                      <div className="d-flex mr-4 ml-4 mb-3">
                        <div className="mr-1">
                          <Form.Check onChange={this.handleClickCheckAll} checked={areAllChecked} type="checkbox" />
                        </div>
                        <div className="d-flex align-items-center justify-content-start">
                          <Button icon={checkIcon} onClick={this.handleClickApproveAll} />
                          <Button icon={closeIcon} onClick={this.handleClickDeclineAll} />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {reportGroups.map(group => (
                        <ReportGroup
                          group={group}
                          handleClickApprove={this.handleClickApprove}
                          handleClickDecline={this.handleClickDecline}
                          handleClickRework={this.handleClickRework}
                          handleClickCheckbox={this.handleClickCheckbox}
                          isChecked={this.isChecked}
                        />
                      ))}
                    </Col>
                  </Row>
                </Container>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  authToken: auth.token,
});

export default connect(mapStateToProps)(CheckReports);
