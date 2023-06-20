import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { IQueryResponse } from '../../Interfaces';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { PlayArrow } from '@mui/icons-material';

export default function ListResults(props: { items?: IQueryResponse[] }) {

    const { items } = props

    return (
        <List style={{ background: 'transparent', width: '100%' }} className='search-results-list'>
            {
                items?.map((item) =>
                    <Link className=''
                        key={item.fileId}
                        to={`/${item.fileDownloadLink}` ?? '#invalid-video-link'}
                    >
                        <ListItem className="result-list-item">
                            <img
                                loading='lazy'
                                alt='ICON'
                                className='result-list-thumb'
                                src={`${import.meta.env.VITE_APP_SV_UPLOADS}/${item.fileThumbnail}`}
                            />
                            <ListItemText
                                style={{ paddingInline: '.4rem', textTransform: 'capitalize' }}
                                // primary={''.concat(item.fileUploader as any)}
                                secondary={
                                    <p className='list-item-caption'>
                                        {item.fileCaption}
                                    </p>
                                }
                            />
                            <Button className="is-icon">
                                <PlayArrow />
                            </Button>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </Link>)
            }
            {/* <Button>
                MORE RESULTS
            </Button> */}
        </List>
    );
}