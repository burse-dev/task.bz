import React, { Component } from 'react';
import styled from 'styled-components';
import uploadIcon from './uploadIcon.svg';
import closeIcon from '../../../img/closeIcon.svg';

const Label = styled.label`
  ${({ error }) => (error && 'border: 1px solid red;')}
  padding: 33px 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: #eee;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  color: #333;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 20px;
`;

const Wrapper = styled.div`
  input[type="file"] {
    display: none;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #e2e2e2;
`;

const ClearIcon = styled.img`
  box-sizing: content-box;
  padding: 5px;
  position: absolute;
  top: 15px;
  right: 15px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  background: #fff;
  border-radius: 5px;
  transition: .2s;
  :hover {
    box-shadow: -8px 8px 15px rgba(0,0,0,0.1);
  }
`;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { input: { value } } = nextProps;
    if (value !== prevState.imageUrl) {
      if (typeof value === 'object') {
        return { imageUrl: URL.createObjectURL(value) };
      }

      if (typeof value === 'string' || typeof value === 'undefined') {
        return { imageUrl: value };
      }

      if (typeof prevState.imageUrl === 'string') {
        return { imageUrl: prevState.imageUrl };
      }
    }

    return null;
  }

  onChange = async (e) => {
    const { input: { onChange } } = this.props;
    onChange(e.target.files[0]);
    // this.setImage(URL.createObjectURL(e.target.files[0]));
  };

  clearImage = async () => {
    const { input: { onChange } } = this.props;
    onChange(null);
    this.setState({
      imageUrl: null,
    });
  };

  render() {
    const { imageUrl } = this.state;
    const { meta: { touched, error } } = this.props;

    return (
      <Wrapper>
        {imageUrl ? (
          <ImageWrapper>
            <Image src={imageUrl} />
            <ClearIcon onClick={this.clearImage} src={closeIcon} />
          </ImageWrapper>
        ) : (
          <Label error={touched && error}>
            <Icon src={uploadIcon} />
            <div>
              Выберите
              <br />
              изображение
            </div>
            <input
              type="file"
              accept=".jpg, .png, .jpeg, .svg"
              onChange={this.onChange}
            />
          </Label>
        )}
      </Wrapper>
    );
  }
}
