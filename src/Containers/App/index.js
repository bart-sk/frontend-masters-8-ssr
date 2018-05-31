import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Panel from '../../Components/Panel'

const Body = styled.div``;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
  `;

class App extends PureComponent {
  static childContextTypes = {
    setBreadcrumb: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      breadcrumb: null,
    };
  }
  getChildContext = () => ({
    setBreadcrumb: this.getBreadcrumb,
  });
  getBreadcrumb = (breadcrumb) => {
    this.setState({
      breadcrumb,
    });
  }
  render() {
    return (
      <Body>
        <Container>
          <Panel breadcrumb={this.state.breadcrumb} />
          <Content>
            {this.props.children}
          </Content>
        </Container>
      </Body>
    );
  };
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;