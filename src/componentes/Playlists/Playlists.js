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
  const [namePlaylist, setNamePlaylist] = useState('');
  const [pesquisa, setPesquisa] = useState({ nome: '' });

  const headers = {
    headers: {
      Authorization: "felipe-amaral-easley",
    },
  };

  useEffect(() => {
    getAllPlaylists();
  }, []);

  useEffect(() => {
    pesquisaPlaylist(pesquisa);
}, [pesquisa]);




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

  const pesquisaPlaylist = async (pesquisa) => {
    try {
        const resp = await axios.get(
            `https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/search?name=${pesquisa.nome}`,
            {
                headers: {
                    Authorization: 'amanda-polari-easley',
                },
            }
        );
        console.log('entrou no try', resp);
        resp.data.result.playlist.length
            ? setPlaylists(resp.data.result.playlist)
            : getAllPlaylists();
    } catch (error) {
        console.log('entrou no catch');
        console.log(error.response);
    }
};

const enviarDados = () => {
    const novaPesquisa = {
        nome: namePlaylist,
    };
    setPesquisa(novaPesquisa);
    setNamePlaylist('');
};

const resete = () => {
    getAllPlaylists();
};


  return (
    <div>
            <div>
                <input
                    value={namePlaylist}
                    onChange={(e) => setNamePlaylist(e.target.value)}
                    placeholder="Nome da Playlist"
                />
                <button
                    type="submit"
                    onClick={() => {
                        enviarDados();
                    }}
                >
                    Pesquisar
                </button>
                <button
                    onClick={() => {
                        resete();
                    }}
                >
                    Limpar
                </button>
            </div>
            {playlists.map((playlist) => {
                return <Musicas key={playlist.id} playlist={playlist} getAllPlaylists={getAllPlaylists} />;
            })}
        </div>
  );
}

export default Playlists;