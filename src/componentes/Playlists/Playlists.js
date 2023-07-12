import React, { useEffect, useState } from "react";
import Musicas from "../Musicas/Musicas";
import axios from "axios";

// const playlistsLocal = [
//   {
//     id: 1,
//     name: "Playlist 1",
//   },
//   {
//     id: 2,
//     name: "Playlist 2",
//   },
//   {
//     id: 3,
//     name: "Playlist 3",
//   },
//   {
//     id: 4,
//     name: "Playlist 4",
//   },
// ];

function Playlists() {
  const [playlists, setPlaylists] = useState([]);

  const headers = {
    headers: {
      Authorization: "felipe-amaral-easley",
    },
  };

  useEffect(() => {
    getAllPlaylists();
  }, []);

  const getAllPlaylists = () => {
    axios
      .get(
        `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists`,
        headers
      )
      .then((resp) => {
        console.log("sucesso get playlist: ", resp.data.result.list);
        setPlaylists(resp.data.result.list);
      })
      .catch((error) => {
        console.log("erro get playlists: ", error.response);
      });
  };

  return (
    <div>
      {playlists.map((playlist) => {
        return (
          <Musicas key={playlist.id} playlist={playlist} headers={headers} />
        );
      })}
    </div>
  );
}

export default Playlists;