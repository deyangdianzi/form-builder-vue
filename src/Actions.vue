<template>
  <div v-if="currentFileId">
    <!--    <el-button size="small" plain @click="() => onSetPreviewMode(true)">预览</el-button>-->
    <el-select :value="pageType" size="small" style="margin-right: 10px;" @change="onPageTypeChange">
      <el-option label="列表页" value="list-page" />
      <el-option label="表单页" value="form-page" />
      <el-option label="详情页" value="detail-page" />
    </el-select>
    <el-button size="small" plain @click="() => setSchemaVisible(true)">查看Schema</el-button>
    <el-button size="small" plain :loading="codeLoading" @click="() => setCodeVisible(true)">查看Code</el-button>
    <el-button size="small" type="primary" :loading="saveLoading" @click="saveSchema">保存</el-button>
    <el-popconfirm
      title="清空以后无法恢复, 是否继续？"
      confirmButtonText="确认"
      cancelButtonText="取消"
      @onConfirm="clearSchema"
    >
      <el-button slot="reference" size="small" style="float: right;" plain type="danger">
        清空
      </el-button>
    </el-popconfirm>

    <el-dialog title="Schema" :visible.sync="schemaVisible" top="5%" width="70%" append-to-body>
      <prism-editor :code="schemaStr" language="js"></prism-editor>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadSchema">下载</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Code" :visible.sync="codeVisible" top="5%" width="70%" append-to-body>
      <prism-editor :code="code.text" language="vue"></prism-editor>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadVue">下载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { safeStringify } from "./helper/util";
import { formatCode, saveSchema } from "./helper/service";
import fileDownload from "js-file-download";

export default {
  name: "Actions",
  data() {
    return {
      preview: false,
      schemaVisible: false,
      codeVisible: false,
      code: {},
      codeLoading: false,
      saveLoading: false,
    };
  },
  computed: {
    ...mapGetters(["schema", "schemaStr", "previewMode", "pageType", "currentFileId"]),
  },
  methods: {
    ...mapMutations(["setSchema", "setPreviewMode", "setPageType"]),
    clearSchema() {
      this.setSchema({ schema: [] });
    },
    onSetPreviewMode() {
      this.setPreviewMode({ previewMode: !this.previewMode });
    },
    onPageTypeChange(pageType) {
      this.setPageType({ pageType });
    },
    setSchemaVisible(schemaVisible) {
      this.schemaVisible = schemaVisible;
    },
    async setCodeVisible(codeVisible) {
      if (codeVisible) {
        try {
          this.codeLoading = true;
          const res = await formatCode(this.schema, this.pageType);
          if (res.success) {
            this.code = res.data;
            this.codeVisible = true;
          } else {
            this.$message.error(res.message);
          }
        } catch (e) {
          this.$message.error(e.message);
        } finally {
          this.codeLoading = false;
        }
      } else {
        this.code = {};
        this.codeVisible = false;
      }
    },
    downloadSchema() {
      fileDownload(safeStringify(this.schema), "schema.json");
    },
    downloadVue() {
      fileDownload(this.code.text, `${this.code.uuid}.vue`);
    },
    async saveSchema() {
      this.saveLoading = true;
      try {
        const res = await saveSchema(this.currentFileId, this.schema);
        if (res.success) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.saveLoading = false;
      }
    },
  },
};
</script>
