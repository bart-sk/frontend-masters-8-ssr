import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { rem } from 'polished';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import API from '../../API';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 0 0 100%;
`;
const Item = styled(Link) `
  flex: 0 0 22%;
  background: white;
  margin: 1.5%;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px ${rem(30)} 0px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  :hover img {
    transform: scale(1.2) rotate(5deg);
  }
`;
const ImageWrapper = styled.div`
  padding: ${rem(50)};
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Img = styled.img`
  width: 100%;
  max-width: ${rem(200)};
  transition: all 0.2s linear;
`;
const Description = styled.div`
  display: flex;
  flex-direction: column;
  letter-spacing: ${rem(1)};
  padding: ${rem(20)} ${rem(50)};
  text-align: center;
  border-top: 1px solid #ebebeb;
`;
const Name = styled.div`
  text-transform: uppercase;
  font-size: ${rem(16)};
  min-height: ${rem(65)};
`;
const Price = styled.div`
  font-size: ${rem(14)};
  font-weight: bold;
  padding: ${rem(10)} 0;
`;

class ProductList extends PureComponent {
  static contextTypes = {
    setBreadcrumb: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }
  componentDidMount() {
    this.context.setBreadcrumb(
      <div>
        <strong>Kategória: </strong>Domáce potreby
      </div>
    );
    API.listProducts().then((res) => {
      this.setState({
        items: res.products,
      });
    }).catch((e) => {
      console.error(e);
    });
  }
  render() {
    const { items } = this.state;
    if (items.length === 0) {
      return null;
    }
    return (
      <Wrapper>
        <Helmet>
          <title>Domáce potreby</title>
        </Helmet>
        {items.map((item) => {
          return (
            <Item key={item._id} to={`/product/${item._id}`}>
              <ImageWrapper>
                <Img src={item.image} />
              </ImageWrapper>
              <Description>
                <Name>{item.name}</Name>
                <Price>{item.price}</Price>
              </Description>
            </Item>
          );
        })}
      </Wrapper>
    );
  }
}

export default ProductList;