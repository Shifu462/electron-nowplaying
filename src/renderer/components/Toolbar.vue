<template>
    <header class="toolbar">
        <div class="toolbar-item toolbar__minimize" @click="remoteWindow.minimize()"></div>
        <div class="toolbar-item toolbar__cross" @click="remoteWindow.close()"></div>
    </header>
</template>

<script>
    import { remote } from 'electron';

    export default {
        components: {},
        data() {
            return {
                remoteWindow: remote.getCurrentWindow()
            }
        },
        watch: {
            
        },
        computed: {
        },
        
        methods: {

        }
    };
</script>

<style lang="scss" scoped>
    $itemSize: 12px;
    $itemColor: #B2B2B2;

    .toolbar {
        width: 100%;
        -webkit-app-region: drag;

        box-sizing: border-box;

        padding: 8px 20px;

        display: flex;
        justify-content: flex-end;

        .toolbar-item {
            -webkit-app-region: no-drag;
            cursor: pointer;

            display: inline-block;
            width: $itemSize;
            height: $itemSize;
            flex-shrink: 0;
            margin-left: 10px;

        }

        &__minimize {
            border-bottom: 2px solid $itemColor;
        }

        &__cross {
            position: relative;

            &::before, &::after {
                content: '';
                display: block;
                width: $itemSize;
                height: 2px;
                background-color: $itemColor;
                
                position: absolute;
                top: 5px;
            }

            &::before {
                transform: rotate(45deg);
            }

            &::after {
                transform: rotate(-45deg);
            }
        }
    }

</style>