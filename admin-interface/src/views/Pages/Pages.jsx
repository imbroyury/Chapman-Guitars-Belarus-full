import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAsync, useAsyncFn } from 'react-use';
import useEditableCollection from '../../hooks/useEditableCollection.js';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Spinner, ErrorSnackbar, EditProperty, DisplayProperty } from '../../components';
import { Remount } from '../../HOC/Remount';
import { mainProperties } from './properties';
import { getRequest, deleteRequest, postRequest } from '../../services/NetworkService.js';

const useStyles = makeStyles({
  card: {
    margin: '10px',
  },
});

const Pages = (props) => {
  const reloadHandler = props.remount;
  const classes = useStyles();

  const [shouldFetch, setShouldFetch] = useState(true);
  const scheduleRefetch = () => setShouldFetch(true);
  const resetAfterFetch = () => setShouldFetch(false);

  const [
    setInitialPages,
    setPageEditModeOn,
    setPageEditModeOff,
    editPageProperty,
    pages,
    getEditedPagePropertiesPayload,
  ] = useEditableCollection();

  const pagesRequestState = useAsync(async () => {
    if (!shouldFetch) return;
    const { data: pages } = await getRequest('/pages');
    resetAfterFetch();
    setInitialPages(pages);
    return pages;
  }, [shouldFetch]);

  const [savePagesState, savePage] = useAsyncFn(async (id) => {
    const propertiesPayload = getEditedPagePropertiesPayload(
      id,
      mainProperties,
    );
    const { data: saveResult } = await postRequest(
      '/page',
      { id, ...propertiesPayload },
    );
    scheduleRefetch();
    return saveResult;
  }, [pages]);

  const [deletePageState, deletePage] = useAsyncFn(async (id) => {
    const { data: deleteResult } = await deleteRequest(
      '/page',
      { data: { id } },
    );
    scheduleRefetch();
    return deleteResult;
  }, []);

  const handleSavePage = (id) => {
    setPageEditModeOff(id);
    savePage(id);
  };

  const requestStates = [
    pagesRequestState,
    savePagesState,
    deletePageState,
  ];

  const isSomeRequestInProgress = requestStates.some(state => state.loading);

  const requestErrors = requestStates
    .filter(state => state.error)
    .map(state => state.error);

  const hasSomeRequestErred = requestErrors.length > 0;

  const isInteractionDisabled = isSomeRequestInProgress || hasSomeRequestErred;

  const renderPropertyEditMode = (page, property) =>
    <EditProperty
      key={property.name}
      item={page}
      property={property}
      onChange={editPageProperty(page.id)}
      disabled={isInteractionDisabled}
    />;

  const renderEditMode = (page) => (<Card className={classes.card} key={page.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyEditMode(page, property))}
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSavePage(page.id)}
        disabled={isInteractionDisabled}
      >
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => deletePage(page.id)}
        disabled={isInteractionDisabled}
      >
        Delete
      </Button>
    </CardActions>
  </Card>);

  const renderPropertyDisplayMode = (page, property) =>
    <DisplayProperty
      key={property.name}
      item={page}
      property={property}
    />;

  const renderDisplayMode = (page) => (<Card className={classes.card} key={page.id}>
    <CardContent>
      {mainProperties.map(property => renderPropertyDisplayMode(page, property))}
    </CardContent>
    <CardActions>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setPageEditModeOn(page.id)}
        disabled={isInteractionDisabled}
      >
        Edit
      </Button>
    </CardActions >
  </Card>);

  const renderPage = (page) => page.isEditMode ?
    renderEditMode(page.edited) :
    renderDisplayMode(page.initial);

  const renderErrorMessage = (error) =>
    <ErrorSnackbar
      open
      errorMessage={error.message}
      key={error.message}
      actionLabel='Reload'
      actionHandler={reloadHandler}
    />;

  return (<Grid container>
    {<Spinner open={isSomeRequestInProgress} />}
    {requestErrors.map(renderErrorMessage)}
    {pages.map(renderPage)}
  </Grid>);
};

Pages.propTypes = {
  remount: PropTypes.func,
};

export default Remount(Pages);
