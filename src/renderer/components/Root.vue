<template>
    <div id="wrapper">
        <main>
            <div class="left-side">
                <span class="title">Welcome to your new project!</span>
            </div>

            <div class="right-side">
                <div class="doc">
                    <div class="title">Log in</div>

                    <input type="text" v-model="token"/>
                    <button class="alt" @click="open(tokenUrl)">Login</button>
                </div>
                <div class="doc">
                <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
                <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
            </div>
            </div>
        </main>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron';

    export default {
        name: "root",
        components: {},
        watch: {
            token(val) {
                console.log(val);

                let m = val.match(/.+?\/?code=(.+)/);
                if (m) {
                    let code = m[1];
                    console.log(code);

                    this.$router.push('/main');
                    ipcRenderer.send('resize-for-main');
                }
            }
        },
        computed: {
            tokenUrl() {
                return 'https://accounts.spotify.com/authorize?client_id=7633771350404368ac3e05c9cf73d187&redirect_uri=https://blank.org/&response_type=code&scope=user-read-playback-state';
            }
        },
        data() {
            return {
                token: '',
            }
        },
        methods: {
            open(link) {
                this.$electron.shell.openExternal(link);
            }
        }
    };
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
