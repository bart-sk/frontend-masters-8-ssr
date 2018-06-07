import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rem, lighten } from 'polished';
import { Helmet } from 'react-helmet';
import { loadProductDetail } from './actions';
import {
  currentProductDetailSelector,
  currentProductIsFetchingSelector,
} from './selectors';
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

  static init(dispatch, props) {
    const {
      params: { productId },
    } = props;
    return Promise.all([dispatch(loadProductDetail(productId))]);
  }

  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    try {
      await Product.init(dispatch, this.props);
    } catch (e) {
      // No need to handle 404 error here
    }
    if (this.props.data) {
      this.context.setBreadcrumb(
        <div>
          <strong>Produkt: </strong>
          {this.props.data.name}
        </div>,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      try {
        Product.init(nextProps.dispatch, nextProps);
      } catch (e) {
        // No need to handle 404 error here
      }
    }
  }

  changeCount(newCount) {
    this.setState({
      count: newCount > 1 ? newCount : 1,
    });
  }
  render() {
    const { data, isFetching } = this.props;

    if (!data && !isFetching) {
      return (
        <Wrapper>
          <NotFound />
        </Wrapper>
      );
    }

    if (isFetching && !data) {
      return <Loader />;
    }

    return (
      <Wrapper>
        <Helmet>
          <title>{data.name}</title>
        </Helmet>
        <ImageWrapper>
          <Image src={data.image} />
        </ImageWrapper>
        <Detail>
          <Header>{data.name}</Header>
          <Description dangerouslySetInnerHTML={{ __html: data.description }} />
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
      </Wrapper>
    );
  }
}

Product.fetchData = ({ store, renderProps }) => {
  return Product.init(store.dispatch, renderProps);
};

Product.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
  }),
  // eslint-disable-next-line
  params: PropTypes.shape({
    productId: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

Product.defaultProps = {
  data: null,
};

const mapStateToProps = (state, props) => {
  const { productId } = props.params;
  return {
    isFetching: currentProductIsFetchingSelector(productId)(state),
    data: currentProductDetailSelector(productId)(state),
  };
};

export default connect(mapStateToProps)(Product);
