<template>
  <div class="hello">
    <p>{{ message }}</p>
    <p>I will add {{number1}} to {{number2}} on the server</p>

    <p>Server Response Message: {{messageResponse}}</p>
    <p>Server Response Add: {{addResponse}}</p>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class HelloWorld extends Vue {
   private message: string = "I will send this to the server";
   private number1: number = 2;
   private number2: number = 5

   private messageResponse = "";
   private addResponse = ""
   mounted() {
     let key: string = "?code=KTtarDLQ/PovFhwXsaa4GX7D6jg8zS7z9YDlRy2UQNV33NgCUeCZsg==";
     let addNumsURL = "https://funder-test-functions.azurewebsites.net/api/addTwoNumbers";
     let messageURL = "https://funder-test-functions.azurewebsites.net/api/messageReturn";
     axios.post(messageURL + key, {"message": this.message}).then(result=>{
       console.log('success!');
       this.messageResponse = result.data;
     }, reason => {
       console.log('Message failure: ' + reason)
     })
     axios.post(addNumsURL + key, {"number_one": this.number1, "number_two": this.number2}).then(result=>{
       console.log('success!');
       this.addResponse = result.data;
     }, reason =>{
       console.log('Add failure: ' + reason);
     })
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
