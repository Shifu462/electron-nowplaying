<template>
    <div id="wrapper">
        <Toolbar />

        <main>
            <div class="left-side">
                <span class="title">Привет!</span>
                <p>
                    Чтобы залогиниться, нажми Login, залогинься в спотифае, 
                    потом скопируй полностью ссылку в текстовое поле. <br />
                    Это временная мера, пока мне впадлу делать нормально.
                </p>
            </div>

            <div class="right-side">
                <input type="text" v-model="token"/>
                <button class="alt" @click="open(tokenUrl)">Login</button>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
    import { remote } from 'electron';
    import Toolbar from './Toolbar.vue';
    import { Vue, Component, Watch } from 'vue-property-decorator';
    
    @Component({
        components: { Toolbar }
    })
    export default class Welcome extends Vue {
        token = '';

        @Watch('token')
        onTokenChanged(val: any) {
            console.log(val);

            let m = val.match(/.+?\/?code=(.+)/);
            if (m) {
                let code = m[1];
                console.log(code);

                remote.getCurrentWindow().setSize(450, 685);

                (this as any).$router.push('/main');
                
            }
        }

        get tokenUrl() {
            return 'https://accounts.spotify.com/authorize?client_id=7633771350404368ac3e05c9cf73d187&redirect_uri=https://blank.org/&response_type=code&scope=user-read-playback-state';
        }

        open(link: string) {
            this.$electron.shell.openExternal(link);
        }
    }
</script>

<style>
    @import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        user-select: none;
        cursor: default;
    }

    body {
        font-family: "Source Sans Pro", sans-serif;
    }
</style>

<style lang="less" scoped>

#wrapper > main {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;

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

p {
  color: black;
  margin-bottom: 10px;
}

button {
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
  color: #42b983;
  background-color: transparent;
}

button.alt {
  
}
</style>
