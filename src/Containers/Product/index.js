import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rem, lighten } from 'polished';
import { Helmet } from 'react-helmet';
import API from '../../API';
import NotFound from '../../Components/NotFound';
import Loader from '../../Components/Loader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 97%;
  margin: 1.5%;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px ${rem(30)} 0px;
  padding: ${rem(50)};
  background: #fff;
`;
const ImageWrapper = styled.div`
  flex: 0 0 35%;
  padding: ${rem(20)};
  text-align: center;
`;
const Image = styled.img`
  width: 100%;
  max-width: ${rem(350)};
  height: auto;
`;
const Detail = styled.div`
  padding: ${rem(20)};
`;
const Header = styled.div`
  color: #6e6e6e;
  letter-spacing: ${rem(2)};
  font-size: ${rem(32)};
  padding-bottom: ${rem(15)};
  margin-bottom: ${rem(15)};
  border-bottom: 3px solid #efefef;
  text-transform: uppercase;
`;
const Price = styled.div`
  padding: ${rem(30)} 0;
  font-weight: bold;
  font-size: ${rem(20)};
`;
const Description = styled.div`
  color: #3e3e3e;
  text-align: justify;
  font-size: ${rem(18)};
`;
const AddToCart = styled.div`
  display: flex;
`;
const Counter = styled.div`
  display: flex;
  padding-right: ${rem(30)};
`;
const Button = styled.button`
  background: white;
  border: 1px solid #dedede;
  padding: ${rem(10)} ${rem(20)};
  font-size: ${rem(22)};
  font-weight: bold;
  cursor: pointer;
  :focus {
    outline: none;
  }
`;
const Input = styled.input`
  border: 1px solid #dedede;
  padding: 0 ${rem(20)};
  max-width: ${rem(60)};
  font-size: ${rem(18)};
`;

const AddToCartButton = styled.button`
  background: ${({ theme }) => theme.color.primary};
  padding: 0 ${rem(30)};
  border: 0;
  color: white;
  font-weight: bold;
  font-size: ${rem(16)};
  display: flex;
  align-items: center;
  cursor: pointer;
  :hover {
    background: ${({ theme }) => lighten(0.1, theme.color.primary)};
  }
`;
const Icon = styled.img`
  width: ${rem(30)};
  margin-right: ${rem(15)};
`;
const Label = styled.div``;

class Product extends PureComponent {
  static contextTypes = {
    setBreadcrumb: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
      data: null,
      isFetching: false,
    };
  }
  componentDidMount() {
    this.loadProduct(this.props.routeParams.productId);
  }
  loadProduct(id) {
    this.setState({
      isFetching: true,
    });
    API.productDetail(id)
      .then(res => {
        this.context.setBreadcrumb(
          <div>
            <strong>Produkt: </strong>
            {res.name}
          </div>,
        );
        this.setState({
          data: res,
          isFetching: false,
        });
      })
      .catch(e => {
        this.setState({
          isFetching: false,
        });
        console.error(e);
      });
  }
  changeCount(newCount) {
    this.setState({
      count: newCount > 1 ? newCount : 1,
    });
  }
  render() {
    const { data, isFetching } = this.state;
    if (!data && !isFetching) {
      return (
        <Wrapper>
          <NotFound />
        </Wrapper>
      );
    }
    return (
      <Wrapper>
        {isFetching ? (
          <Loader />
        ) : (
          <React.Fragment>
            <Helmet>
              <title>{data.name}</title>
            </Helmet>
            <ImageWrapper>
              <Image src={data.image} />
            </ImageWrapper>
            <Detail>
              <Header>{data.name}</Header>
              <Description
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
              <Price>{data.price}/ks</Price>
              <AddToCart>
                <Counter>
                  <Button
                    onClick={() => {
                      this.changeCount(this.state.count - 1);
                    }}
                  >
                    -
                  </Button>
                  <Input defaultValue={this.state.count} />
                  <Button
                    onClick={() => {
                      this.changeCount(this.state.count + 1);
                    }}
                  >
                    +
                  </Button>
                </Counter>
                <AddToCartButton>
                  <Icon src="/cart.svg" />
                  <Label>Pridať do košíka</Label>
                </AddToCartButton>
              </AddToCart>
            </Detail>
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

Product.propTypes = {
  routeParams: PropTypes.shape({
    productId: PropTypes.string,
  }).isRequired,
};

export default Product;
