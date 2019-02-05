import * as React from 'react';
import {Component} from 'react';
import {GHCorner} from 'react-gh-corner';
import Masonry from 'react-masonry-component';
import FieldText from '@atlaskit/field-text';
import {AppWrapper, OptionsWrapper, PhotoWrapper} from './styled';
import Unsplash, { SearchResponse } from '../src';

export interface AppState {
  query: string;
  accessKey: string;
  photos: SearchResponse[];
}
const localStorageKey = 'unsplash-client-key';
const repoUrl = 'https://github.com/zzarcon/unsplash-client';
const defaultAccessKey = localStorage.getItem(localStorageKey) || '';

export default class App extends Component <{}, AppState> {
  client: Unsplash = new Unsplash(defaultAccessKey);
  state: AppState = {
    query: 'skateboarding',
    accessKey: defaultAccessKey,
    photos: []
  }

  onQueryChange = async (event: any) => {
    const query = event.target.value;
    this.setState({query});
    const photos = await this.client.search(query, {perPage: 50});
    this.setState({photos})
  }

  onAccessKeyChange = (event: any) => {
    const accessKey = event.target.value;
    localStorage.setItem(localStorageKey, accessKey);
    this.setState({accessKey});
    this.client = new Unsplash(accessKey);
  }

  renderPhotos = () => {
    const {photos} = this.state;
    if (!photos.length) return;

    const photosContent = photos.map(photo => {
      return (
        <PhotoWrapper key={photo.id}>
          <img src={photo.urls.thumb} alt={photo.id} />
        </PhotoWrapper>
      )
    });

    return (
      <Masonry options={{columnWidth: 250}}>
        {photosContent}
      </Masonry>
    )
  }

  render() {
    const {accessKey} = this.state;

    return (
      <AppWrapper>
        <GHCorner openInNewTab href={repoUrl} />
        <OptionsWrapper>
          <FieldText value={accessKey} placeholder="" label="accessKey" onChange={this.onAccessKeyChange} />
          <FieldText placeholder="Search something..." label="query" onChange={this.onQueryChange} />  
        </OptionsWrapper>
        {this.renderPhotos()}
      </AppWrapper>
    )
  }
}