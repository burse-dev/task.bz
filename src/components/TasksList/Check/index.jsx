import React, { Component } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ReportGroup from './ReportGroup';
import Preloader from '../../generic/Preloader';
import checkIcon from '../../img/checkedIcon.svg';
import closeIcon from '../../img/closeIcon.svg';
import SmallButton from '../../generic/Buttons/SmallButton';

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

    return fetch(`/api/reports/${id}`, {
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
        }
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
    const { loading, title, areAllChecked, reportGroups } = this.state;
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
            {!reportGroups.length && (
              <div>
                <Container className="vh-80">
                  <div className="pt-3 pt-lg-5 pb-lg-3">
                    <h2>Отчетов нет</h2>
                  </div>
                </Container>
              </div>
            )}
            {!!reportGroups.length && (
              <>
                <Container>
                  <div className="pt-3 pt-lg-5 pb-lg-3">
                    <h2>
                      Отчеты на проверку по задаче:
                      {' '}
                      {title}
                    </h2>
                  </div>

                  <div className="d-flex mr-4 ml-4">

                    <div className="mr-1">
                      <Form.Check onChange={this.handleClickCheckAll} checked={areAllChecked} type="checkbox" />
                    </div>

                    <div className="d-flex align-items-center justify-content-start">
                      <Button icon={checkIcon} onClick={this.handleClickApproveAll} />
                      <Button icon={closeIcon} onClick={this.handleClickDeclineAll} />
                    </div>
                  </div>
                </Container>

                <Container className="pt-3 vh-80">
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
