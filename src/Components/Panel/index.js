import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { rem, lighten } from 'polished';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
`;
const LogoWrapper = styled(Link)`
  background: ${({ theme }) => theme.color.primary};
  flex-basis: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;
const LogoTitle = styled.div`
  color: white;
  text-align: center;
  font-size: ${rem(20)};
  letter-spacing: ${rem(2)};
`;
const Logo = styled.img`
  width: 70px;
  height: 70px;
`;
const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 90%;
`;
const MenuWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-basis: 80%;
`;
const Categories = styled.div`
  display: flex;
  flex-direction: row;
  flex-basis: 90%;
  padding: ${rem(35)} ${rem(25)};
  width: 100%;
  background: #1e222d;
`;
const Category = styled.div`
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding: ${rem(10)};
  text-transform: uppercase;
  letter-spacing: ${rem(2)};
  font-size: ${rem(14)};
  border-bottom: 2px solid transparent;
  :hover {
    border-color: rgba(255, 255, 255, 0.5);
  }
`;
const Header = styled.div`
  padding: ${rem(25)};
  background: #6d788b;
  padding-left: ${rem(25)};
  color: white;
  letter-spacing: ${rem(2)};
  text-transform: uppercase;
  font-size: ${rem(14)};
  min-height: ${rem(67)};
`;
const CartWrapper = styled.div`
  background: ${({ theme }) => theme.color.primary};
  flex-basis: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.2s linear all;
  :hover {
    background: ${({ theme }) => lighten(0.1, theme.color.primary)};
  }
`;
const CartIcon = styled.img`
  width: ${rem(40)};
`;

class Panel extends PureComponent {
  render() {
    return (
      <Wrapper>
        <LogoWrapper to="/">
          <Logo src="/logo.svg" />
          <LogoTitle>
            Frontend<br />Masters
          </LogoTitle>
        </LogoWrapper>
        <RightSide>
          <MenuWrapper>
            <Categories>
              <Category>Domáce potreby</Category>
            </Categories>
            <CartWrapper>
              <CartIcon src="/cart.svg" />
            </CartWrapper>
          </MenuWrapper>
          <Header>{this.props.breadcrumb}</Header>
        </RightSide>
      </Wrapper>
    );
  }
}

Panel.propTypes = {
  breadcrumb: PropTypes.node,
};

Panel.defaultProps = {
  breadcrumb: <div />,
};

export default Panel;
