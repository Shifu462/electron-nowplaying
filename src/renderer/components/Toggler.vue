<template>
    <label class="switch">
        <input type="checkbox" v-model="isToggled" @change="onCheckboxClicked">
        <span class="slider slider--rounded"></span>
    </label>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component({})
    export default class Toggler extends Vue {
        @Prop({ type: Boolean, required: true })
        value!: boolean;

        isToggled = this.value;

        onCheckboxClicked(ev: any) {
            this.$emit('input', this.isToggled);
        }
    }
</script>

<style lang="less" scoped>
    @greenColor: #1DB954;
    @darkColor: rgba(44, 44, 44, 0.95);
    @time: .2s;

    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;

        input { 
            opacity: 0;
            width: 0;
            height: 0;
        }
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: @darkColor;
        -webkit-transition: @time;
        transition: @time;

        &:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: @darkColor;
            
            -webkit-transition: @time;
            transition: @time;
        }
    }

    input:checked + .slider {
        background-color: @greenColor;

        &:before {
            transform: translateX(26px);
        }
    }

    input:focus + .slider {
        box-shadow: 0 0 1px @greenColor;
    }

    .slider--rounded {
        border-radius: 34px;

        &:before {
            border-radius: 50%;
        }
    }

</style>