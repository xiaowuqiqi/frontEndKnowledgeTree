import {reactive, provide,computed} from 'vue';
export const initStore = ()=>{
  const store = reactive({
    data:[
      // {name:'11',age:1}
    ],
    setData:(arr)=>{
      store.data = arr
    },
    pushData(item){
      store.data.push(item)
    },
    getAgeList:computed(()=>{
      console.log('getAgeList')
      return store.data.map(item=>item.age);
    }),
    getNameList:computed(()=>{
      return store.data.map(item=>item.name);
    }),
    findData(fn){
      return store.data.find(fn)
    }
  })

  provide('store',store);
}


