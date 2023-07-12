import React, { useEffect, useState } from "react";
import {
  Botao,
  ContainerInputs,
  ContainerMusicas,
  InputMusica,
  Musica,
  Titles,
} from "./styled";
import axios from "axios";

// const musicasLocal = [
//   {
//     artist: "Artista 1",
//     id: "1",
//     name: "Musica1",
//     url: "http://spoti4.future4.com.br/1.mp3",
//   },
//   {
//     artist: "Artista 2",
//     id: "2",
//     name: "Musica2",
//     url: "http://spoti4.future4.com.br/2.mp3",
//   },
//   {
//     artist: "Artista 3",
//     id: "3",
//     name: "Musica3",
//     url: "http://spoti4.future4.com.br/3.mp3",
//   },
// ];

export default function Musicas(props) {
  const { playlist, headers } = props;
  const [musicas, setMusicas] = useState([]);
  const [artist, setArtist] = useState("");
  const [track, setTrack] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    getPlaylistTracks(playlist.id);
  }, [playlist.id]);

  const getPlaylistTracks = (id) => {
    axios
      .get(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}/tracks`,
        headers
      )
      .then((resp) => {
        console.log("sucesso get musicas", resp.data.result.tracks);
        setMusicas(resp.data.result.tracks);
      })
      .catch((error) => {
        console.log("erro get musicas", error.response);
      });
  };

  const addTrackToPlaylist = (id) => {
    if (!track || !artist || !url) {
      alert(`Preencha todos os campos`);
    } else {
      const body = {
        name: track,
        artist: artist,
        url: url,
      };

      axios
        .post(
          `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${id}/tracks`,
          body,
          headers
        )
        .then((resp) => {
          console.log("sucesso add track", resp);
          getPlaylistTracks(id);
          setArtist("")
          setTrack("")
          setUrl("")
        })
        .catch((error) => {
          console.log("erro add track", error.response);
        });
    }
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    axios
      .delete(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${playlistId}/tracks/${trackId}`,
        headers
      )
      .then((resp) => {
        console.log("sucesso remove track", resp);
        getPlaylistTracks(playlistId);
      })
      .catch((error) => {
        console.log("erro remove track", error.response);
      });
  };

  return (
    <ContainerMusicas>
      <h2>{playlist.name}</h2>
      {musicas.map((musica) => {
        return (
          <Musica key={musica.id}>
            <Titles>
              <h3>{musica.name}</h3>
              <h4>{musica.artist}</h4>
            </Titles>
            <iframe width="560" height="315" src={musica.url}title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            <button
              onClick={() => removeTrackFromPlaylist(playlist.id, musica.id)}
            >
              Excluir
            </button>
            <hr style={{ width: "100%" }} />
          </Musica>
        );
      })}
      <ContainerInputs>
        <InputMusica
          placeholder="musica"
          value={track}
          onChange={(ev) => setTrack(ev.target.value)}
        />
        <InputMusica
          placeholder="artista"
          value={artist}
          onChange={(ev) => setArtist(ev.target.value)}
        />
        <InputMusica
          placeholder="url"
          value={url}
          onChange={(ev) => setUrl(ev.target.value)}
        />
        <Botao onClick={() => addTrackToPlaylist(playlist.id)}>
          Adicionar musica
        </Botao>
      </ContainerInputs>
    </ContainerMusicas>
  );
}