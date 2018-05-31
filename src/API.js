/* eslint-disable */
import 'isomorphic-fetch';

class API {

  constructor() {
    this.baseUrl = null;
    this.token = null;
  }

  serializeQueryParams(parameters) {
    const str = [];
    for (let p in parameters) {
      if (parameters.hasOwnProperty(p)) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(parameters[p])}`);
      }
    }
    return str.join('&');
  }

  paramsToObject(params) {
    let query = params.substr(1);
    let result = {};
    query.split("&").forEach(function(part) {
      let item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  }

  mergeQueryParams(parameters, queryParameters) {
    if (parameters.$queryParameters) {
      Object.keys(parameters.$queryParameters)
        .forEach(function(parameterName) {
          const parameter = parameters.$queryParameters[parameterName];
          queryParameters[parameterName] = parameter;
        });
    }
    return queryParameters;
  }

  /**
   * HTTP Request
   * @method
   * @param {string} method - http method
   * @param {string} url - url to do request
   * @param {object} body - body parameters / object
   * @param {object} headers - header parameters
   * @param {object} queryParameters - querystring parameters
   */
  request(method, url, body, headers, queryParameters, form, checkFor401 = true) {
    const queryParams = queryParameters && Object.keys(queryParameters).length ? this.serializeQueryParams(queryParameters) : null;
    const urlWithParams = url + (queryParams ? '?' + queryParams : '');

    // ugly hack, we need to delete Content-Type header with multipart/form-data
    // that way, browser will calculate form specific headers on it's own
    // contentTypeHeader[0] because nearly every header's value is set using array
    const contentTypeHeader = headers['Content-Type'];
    if (contentTypeHeader && contentTypeHeader[0] === 'multipart/form-data') {
      delete headers['Content-Type'];
    }

    if (body && !Object.keys(body).length) {
      body = undefined;
    } else {
      body = JSON.stringify(body);
    }

    if (form && Object.keys(form).length) {
      body = new FormData();
      for (let k in form) {
        body.append(k, form[k]);
      }
    }

    return fetch(urlWithParams, {
        method,
        headers,
        body,
      })
      .then((response) => {
        if (checkFor401) {
          if (response.status === 401) {
            if (typeof this._onResponseUnauthorized === 'function') {
              this._onResponseUnauthorized();
            } else {
              let error = new Error(response.statusText);
              error.response = response;
              throw error;
            }
          }
        }

        if (response.ok) {
          if (response.headers.get('Content-Type').includes('application/json')) {
            return response.json();
          } else if (response.headers.get('Content-Type').includes('application/pdf')) {
            return response.blob();
          }
          return {};
        } else {
          let error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .catch((error) => {
        return error.response.json().then((error_details) => {
          error.details = error_details;
          throw error;
        });
      });
  }

  /**
   * Set base url
   * @method
   * @param {string} baseUrl
   */
  setBaseUrl(baseUrl) {
    this.baseUrl = baseUrl;
  }

  set onResponseUnauthorized(callback) {
    this._onResponseUnauthorized = callback;
  }

  /**
   * Redirects a user to a given url
   * @method
   * @param {string} url
   */
  redirect(url) {
    window.location = url;
  }

  /**
   * List of Products
   * @method
   * @param {object} parameters - method options and parameters
   */
  listProducts(parameters = {}) {
    let path = '/products';
    let body = {};
    let queryParameters = {};
    let headers = {};
    let form = {};

    headers['Accept'] = ['application/json'];
    headers['Content-Type'] = ['application/json'];

    queryParameters = this.mergeQueryParams(parameters, queryParameters);

    return this.request('GET', `${this.baseUrl}${path}`, body, headers, queryParameters, form);
  }

  /**
   * Detail of Product
   * @method
   * @param {object} parameters - method options and parameters
   * @param {string} productId - 
   */
  productDetail(productId, parameters = {}) {
    let path = '/products/{product_id}';
    let body = {};
    let queryParameters = {};
    let headers = {};
    let form = {};

    headers['Accept'] = ['application/json'];
    headers['Content-Type'] = ['application/json'];

    path = path.replace('{product_id}', productId);

    queryParameters = this.mergeQueryParams(parameters, queryParameters);

    return this.request('GET', `${this.baseUrl}${path}`, body, headers, queryParameters, form);
  }

}

export default new API();