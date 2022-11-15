<script>
export default {
   name: 'DataTable',

   props: {
      getColumnOptionsMethod: {
         type: Function,
         default: undefined,
      },
   },

   data() {
      return { columnOptions: undefined }
   },


   computed: {
      finalGetColumnOptionsMethod() {
         return this.getColumnOptionsMethod ?? this.pretendAllColumnOptionsAreDefault
      },
   },

   created() {
      return this.fetchColumnOptions()
         .then((columnOptions) => {
            this.columnOptions = columnOptions
         })
   },

   methods: {
      fetchColumnOptions() {
         return this.finalGetColumnOptionsMethod()
            .then((response) => response.columns)
      },
   },
}
</script>

<template>
   <div />
</template>