<template>
  <el-breadcrumb :separator="config.separator">
    <el-breadcrumb-item v-for="(child, index) in config.options" :key="index">{{ child.text }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "FbBreadcrumb",
  props: {
    config: Object,
  },
};
</script>
