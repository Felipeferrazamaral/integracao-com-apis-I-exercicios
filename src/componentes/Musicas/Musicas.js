import React, { useEffect, useState } from 'react';
import {
    Botao,
    ContainerInputs,
    ContainerMusicas,
    InputMusica,
    Musica,
} from './styled';
import axios from 'axios';

export default function Musicas(props) {
    const [musicas, setMusicas] = useState([]);
    const [name, setName] = useState('');
    const [artist, setArtist] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        getPlaylistTracks(props.playlist.id);
    }, []);

    const getPlaylistTracks = (playlistId) => {
        const headers = {
            headers: {
                Authorization: 'felipe-amaral-easley',
            },
        };

        axios
            .get(
                `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}/tracks`,
                headers
            )
            .then((resp) => {
                // console.log(resp.data.result.tracks);
                setMusicas(resp.data.result.tracks);
            })
            .catch((err) => {
                // console.log(err.reponse);
            });
    };

    const addTrackToPlaylist = (playlistId) => {
        const headers = {
            headers: {
                Authorization: 'felipe-amaral-easley',
            },
        };

        const body = {
            name,
            artist,
            url,
        };

        axios
            .post(
                `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}/tracks`,
                body,
                headers
            )
            .then(() => {
                // console.log('Funcinou: Adicionou Músicas');
                setName('');
                setArtist('');
                setUrl('');
                getPlaylistTracks(props.playlist.id);
            })
            .catch((err) => {
                // console.log('Erro: ', err);
            });
    };

    const removeTrackFromPlaylist = (trackId) => {
        const headers = {
            headers: {
                Authorization: 'felipe-amaral-easley',
            },
        };

        axios
            .delete(
                `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${props.playlist.id}/tracks/${trackId}`,
                headers
            )
            .then(() => {
                getPlaylistTracks(props.playlist.id);
            })
            .catch((error) => {
                // console.log('Não removeu', error.response);
            });
    };

    const deletarPlaylist = (PlaylistId) => {
        axios
            .delete(
                `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${PlaylistId}`,
                {
                    headers: {
                        Authorization: 'felipe-amaral-easley',
                    },
                }
            )
            .then(() => {
                alert('playlist removida');
                props.getAllPlaylists();
            })
            .catch((err) => {
                console.log(err.response);
            });
    };

    return (
        <ContainerMusicas>
            <h2>{props.playlist.name}</h2>
            <button
                onClick={() => {
                    deletarPlaylist(props.playlist.id);
                }}
            >
                X
            </button>
            {musicas.map((musica) => {
                return (
                    <Musica key={musica.id}>
                        <h3>
                            {musica.name} - {musica.artist}
                        </h3>
                        <iframe width="560" height="315" src={musica.url}title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        <button
                            onClick={() => {
                                removeTrackFromPlaylist(musica.id);
                            }}
                        >
                            X
                        </button>
                    </Musica>
                );
            })}
            <ContainerInputs>
                <InputMusica
                    placeholder="artista"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                />
                <InputMusica
                    placeholder="musica"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <InputMusica
                    placeholder="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Botao onClick={() => addTrackToPlaylist(props.playlist.id)}>
                    Adicionar musica
                </Botao>
            </ContainerInputs>
        </ContainerMusicas>
    );
}