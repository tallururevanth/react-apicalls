import React, { useEffect, useState } from 'react';

const Api = () => {
  const [posts, setPosts] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [id, setId] = useState(null);

  useEffect(() => {
    getApi();
  }, []);

  const getApi = () => {
    fetch('http://localhost:3000/posts')
      .then((data) => data.json())
      .then((result) => {
        setPosts(result);
        console.log('Data Fetched');
      });
  };
  const enableEdit = (e) => {
    let postObject = JSON.parse(e.target.name);
    setTitle(postObject.title);
    setAuthor(postObject.author);
    setId(postObject.id);
    console.log(`Update button called for entry ` + postObject.id);
  };
  const deleteEntry = (e) => {
    let delObject = JSON.parse(e.target.name);
    const apiCallDel = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    };
    fetch('http://localhost:3000/posts/' + delObject.id, apiCallDel).then(
      (e) => {
        console.log(`Entry ${delObject.id} Deleted`);
        getApi();
      }
    );
  };
  if (posts == null) {
    return <p id="loading">Loading...</p>;
  }
  return (
    <React.Fragment>
      {id == null ? (
        <div id="addform">
          <form
            id="postform"
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Add button called');
              const apiCallOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: title,
                  author: author,
                }),
              };
              fetch('http://localhost:3000/posts', apiCallOptions)
                .then((response) => response.json())
                .then((data) => {
                  console.log('data posted');
                  getApi();
                  setTitle('');
                  setAuthor('');
                });
            }}
          >
            <input
              type="text"
              value={title}
              id="titlevalue"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              type="text"
              value={author}
              id="authorvalue"
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
            <input type="submit" value="Add" />
          </form>
        </div>
      ) : (
        <div id="updateform">
          <form
            id="postform"
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Update button called');
              const apiCallOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: title,
                  author: author,
                }),
              };
              fetch('http://localhost:3000/posts/' + id, apiCallOptions)
                .then((response) => response.json())
                .then((data) => {
                  console.log('data updated');
                  getApi();
                  setTitle('');
                  setAuthor('');
                  setId(null);
                });
            }}
          >
            <input
              type="text"
              value={title}
              id="titlevalue"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <input
              type="text"
              value={author}
              id="authorvalue"
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
            />
            <input type="submit" value="Update" />
            <button
              onClick={() => {
                setTitle('');
                setAuthor('');
                setId(null);
                console.log('update cancelled');
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <div id="datadisplay">
        <table border="1px">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
          {posts.map((post) => {
            let stringData = JSON.stringify(post);
            return (
              <tr>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>
                  <button name={stringData} onClick={enableEdit}>
                    Edit/Update
                  </button>
                  <button name={stringData} onClick={deleteEntry}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </React.Fragment>
  );
};

export default Api;
