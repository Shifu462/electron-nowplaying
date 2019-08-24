<template>
    <div class="main-window">
        <Toolbar />

        <div class="main-window-content">

            <div class="npc-work">
                <div class="npc-work__label">npc work</div>
                <Toggler v-model="isTogglerToggled" />
            </div>

        </div>

    </div>
</template>

<script>
    import Toolbar from './Toolbar.vue';
    import Toggler from './Toggler.vue';
    
    export default {
        components: {
            Toolbar,
            Toggler,    
        },
        watch: {
            
        },
        computed: {
        },
        data() {
            return {
                isTogglerToggled: true,
            }
        },
        methods: {

        }
    };
</script>

<style lang="scss" scoped>
    @import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Montserrat';
        color: #F9F9F9;
    }

    .main-window {
        background: rgba(44, 44, 44, 0.955);
        
        height: 100vh;
        width: 100vw;
        /* padding: 60px 80px; */
    }

    .main-window-content {
        padding-top: 10px;

        display: flex;
        flex-direction: column;
        align-items: center;

        // border-top: 1px solid #7E7E7E;
    }

    .npc-work {
        &__label {
            font-size: 24px;
            color: #F9F9F9;
            margin-bottom: 15px;
        }
    }

</style>
