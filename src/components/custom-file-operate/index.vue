<template>
  <div class="file-operate-container">
    <div class="card-header">
      <div class="header-title">
        <c-icon i="file-tree-header" class="mr-2"></c-icon>
        <span class="mr-5" style="color:#666;">{{ this.currentLevel === 'projectGroup' ? '项目集目录' : this.currentLevel === 'project' ? '项目目录' : this.currentLevel === 'projectStage' ? '项目阶段目录' : '' }}</span>
      </div>
      <div class="header-operate">
        <c-button type="primary" i="down-next" iSize="14" @click="handleNextCatalogue" :disabled="nextDisabled">下级目录</c-button>
        <c-button type="primary" i="up-previous" iSize="18" @click="handlePrevCatalogue" :disabled="prevDisabled">上级目录</c-button>
        <c-button type="primary" i="upload" iSize="18" @click="handleUploadFile" :disabled="JSON.stringify(currentActiveNode) == '{}' || treeTopInfo.isFileShare || noAuth">上传文件</c-button>
        <c-button type="primary" i="download" iSize="18" @click="handleDownloadFile" :disabled="fileTreeData.length == 0 || treeTopInfo.isFileShare" v-preventReClick="2000">下载文件</c-button>
      </div>
    </div>
    <div class="card-content">
      <div class="left-tree">
        <el-tree ref="tree" node-key="id" :data="fileTreeData" :props="defaultProps" :default-expand-all="true" @node-click="handleNodeClick" @node-contextmenu="handleNodeContextMenu">
          <template slot-scope="{data,node}">
            <!-- <Tooltip :content="data.name" placement="top" :containerDomName="`.el-tree-node__content .tree-row .dom${data.id}`"> -->
            <div :class="['tree-row', currentActiveNode.id === data.id ? 'active' : '']">
              <svg-icon icon-class="file-open" class-name="left-tree-icon file-open-svg" v-if="node.expanded && (data.children && data.children.length > 0)"></svg-icon>
              <svg-icon icon-class="file-close" class-name="left-tree-icon file-close-svg" v-if="!node.expanded || (data.children && data.children.length === 0)"></svg-icon>
              <span ref="create" class="create-part" v-if="showCreateCatalogue && (data.id === 'CC')">
                <el-input ref="createCatalogueInput" v-model="createCatalogueName" :minlength="1" @blur="handleCreateCatalogueBlur"></el-input>
              </span>
              <span ref="rename" class="rename-part" v-else-if="showRename && currentActiveNode && currentActiveNode.id === data.id">
                <el-input ref="renameInput" v-model="reName" :minlength="1" @blur="handleRenameBlur"></el-input>
              </span>
              <span :class="[`real-name dom${data.id}`]" v-else> {{ data.name }} </span>
            </div>
            <!-- </Tooltip> -->
          </template>
        </el-tree>
        <ContextMenu v-if="showContextMenu && !noAuth" :currentRightNode="currentActiveNode" :style="{ top: contextMenuPosition.top + 'px', left: contextMenuPosition.left + 'px', }" @operate="handleContextMenuOperate" @close="showContextMenu = false"></ContextMenu>
      </div>
      <div class="right-table x-scroll">
        <div class="search">
          <el-input v-model="fileBlurName" placeholder="请输入文件名" @keyup.enter.native="getFile(fileBlurName)" :disabled="JSON.stringify(currentActiveNode) == '{}'"></el-input>
          <c-button type="primary" i="search" c="search-svg" @click="getFile(fileBlurName)" :disabled="JSON.stringify(currentActiveNode) == '{}'">搜索</c-button>
        </div>
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column label="文件名" prop="field" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span @click="handleFilePreview(scope.row)" class="file-preview-text"> {{ scope.row.fileName }} </span>
            </template>
          </el-table-column>
          <el-table-column label="文件大小" prop="" align="center" width="120">
            <template slot-scope="scope"> {{ scope.row.fileSize ? scope.row.fileSize + ' mb' : '' }} </template>
          </el-table-column>
          <el-table-column label="上传时间" prop="" align="center" width="150">
            <template slot-scope="scope"> {{ scope.row.createTime }} </template>
          </el-table-column>
          <el-table-column label="操作" prop="" align="center" width="100">
            <template slot-scope="scope">
              <c-icon i="table-rename" tip="重命名" color="#0077FF" @click="handleRenameFile(scope.row)" :disabled="treeTopInfo.isFileShare || noAuth"></c-icon>
              <c-icon i="table-delete" tip="删除" color="#FA4B4B" @click="handleDeleteFile(scope.row)" :disabled="treeTopInfo.isFileShare || noAuth"></c-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <FileUpload v-if="fileUploadDialog.visible" :currentActiveNode="currentActiveNode" @success="handleUploadSuccess" @close="fileUploadDialog.visible = false"></FileUpload>
    </div>
  </div>
</template>

<script>
import ContextMenu from './components/contextmenu.vue'
import FileUpload from '@/views/components/file-upload/index.vue'
import { fileDirGet, fileDirAdd, fileDirRename, fileDirDelete, fileGet, fileRename, fileDelete, singleFileDownload, multipleFileDownload } from '@/api/framework/template-manage/file'
export default {
  components: { ContextMenu, FileUpload, },
  props: {
    initInfo: {
      type: Object,
      default: () => { },
    },
    type: {
      type: String,
      default: '1'
    },
    topName: {
      type: String,
      default: ''
    },
    noAuth: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // 树相关
      fileTreeData: [],
      defaultProps: { children: 'children', label: 'name' },
      treeTopInfo: {},
      currentActiveNode: {},
      currentNodeDom: '',
      currentLevel: '',
      currentParams: {},
      nextDisabled: true,
      prevDisabled: true,
      // 操作菜单
      showContextMenu: false,
      contextMenuPosition: { top: 0, left: 0, },
      // 新增目录
      showCreateCatalogue: false,
      createCatalogueName: '',
      // 重命名
      showRename: false,
      reName: '',
      // 表格相关
      tableData: [],
      tableSelect: [],
      fileUploadDialog: {},
      fileBlurName: '',
      xDialog: { visible: false },
    }
  },
  mounted() {
    // this.init()
  },
  watch: {
    'currentActiveNode': {
      handler: function () {
        this.getFile()
      },
      deep: true,
    },
    'initInfo': {
      handler: function () {
        this.init()
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // 一、初始化相关
    // 0、初始化总调用
    init() {
      this.handleTreeTopInfo()
      this.getFileDir()
    },
    // 1、处理文件树信息
    handleTreeTopInfo() {
      let initInfo = JSON.parse(JSON.stringify(this.initInfo))
      let treeTopInfo = {}
      if (initInfo.nature === 'projectGroup') {
        treeTopInfo.projectSetId = initInfo.id
        treeTopInfo.projectSetName = initInfo.name
        treeTopInfo.levelList = ['projectGroup']
        this.currentLevel = 'projectGroup'
      }
      if (initInfo.nature === 'project') {
        treeTopInfo.projectSetId = initInfo.projectSetId
        treeTopInfo.projectSetName = initInfo.projectSetName
        treeTopInfo.projectId = initInfo.id
        treeTopInfo.projectName = initInfo.name
        treeTopInfo.levelList = ['project', 'projectGroup',]
        this.currentLevel = 'project'
      }
      if (initInfo.nature === 'projectStage') {
        treeTopInfo.projectSetId = initInfo.projectSetId
        treeTopInfo.projectSetName = initInfo.projectSetName
        treeTopInfo.projectId = initInfo.projectId
        treeTopInfo.projectName = initInfo.projectName
        treeTopInfo.stageId = initInfo.stageId
        treeTopInfo.stageName = initInfo.stageName
        treeTopInfo.levelList = ['projectStage', 'project', 'projectGroup',]
        treeTopInfo.isFileShare = initInfo.isFileShare
        this.currentLevel = 'projectStage'
      }
      this.$set(this, 'treeTopInfo', treeTopInfo)
    },
    // 2、处理按钮禁用
    handleCatalogueButton() {
      let matchIndex = this.treeTopInfo.levelList.findIndex(item => item === this.currentLevel)
      this.nextDisabled = false
      this.prevDisabled = false
      if (matchIndex === 0) {
        this.nextDisabled = true
      }
      if (matchIndex === this.treeTopInfo.levelList.length - 1) {
        this.prevDisabled = true
      }
    },
    // 3、获取文件目录
    getFileDir() {
      let params = { projectSetId: this.treeTopInfo.projectSetId || '', projectId: this.treeTopInfo.projectId || '', stageName: this.treeTopInfo.stageName || '', }
      if (this.currentLevel === 'projectGroup') { delete params.projectId, delete params.stageName }
      if (this.currentLevel === 'project') { delete params.stageName }
      if (params.projectSetId || params.projectId || params.stageName) {
        fileDirGet(params).then(res => {
          // console.log('%c【API D⭐】描述：文件目录获取', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：/file/getAllDirectories', 'color:#F0F;font-size:12px;font-weight:700;')
          // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
          // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
          let fileTreeData = JSON.parse(JSON.stringify(res.data || {}))
          if (JSON.stringify(fileTreeData) !== '{}') {
            this.$set(this, 'fileTreeData', [fileTreeData])
            // this.$set(this, 'currentActiveNode', this.fileTreeData[0])
            this.handleCatalogueButton()
            // 初始化设置默认选中
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.fileTreeData[0].id)
              this.handleNodeClick(this.fileTreeData[0])
            })
          } else {
            this.$set(this, 'fileTreeData', [])
          }
        })
      }
    },
    // 4、获取文件
    getFile(blurName) {
      let params = {
        catalogueId: this.currentActiveNode.id,
        fileName: blurName ? blurName : ''
      }
      fileGet(params).then(res => {
        // console.log('%c【API D⭐】描述：获取文件', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
        // console.log('%c【API I⭐】接口：/file/getFilesByCondition', 'color:#F0F;font-size:12px;font-weight:700;')
        // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
        // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
        this.$set(this, 'tableData', res.data || [])
      })
    },

    // 二、操作相关
    // 1、鼠标左击节点
    handleNodeClick(data) {
      if (this.currentActiveNode.id !== data.id) { this.fileBlurName = '' }
      this.showContextMenu = false
      this.$set(this, 'currentActiveNode', data)
    },
    // 2、鼠标右击节点界面显示
    async handleNodeContextMenu(event, nodeObj, node, self) {
      if (this.treeTopInfo.isFileShare) { return false }
      if (this.currentActiveNode.id !== nodeObj.id) { this.fileBlurName = '' }
      this.showContextMenu = false
      this.showRename = false
      this.showContextMenu = true
      this.$nextTick(() => {
        let contextmenuDom = document.getElementsByClassName('contextmenu-container')[0]
        let contextmenuDomHeight = contextmenuDom ? contextmenuDom.clientHeight : 0
        // console.log('window.innerHeight', window.innerHeight)
        // console.log('event.clientY', event.clientY)
        if (window.innerHeight - event.clientY > 100) {
          this.$set(this.contextMenuPosition, 'top', event.clientY + 15)
        } else {
          this.$set(this.contextMenuPosition, 'top', event.clientY - contextmenuDomHeight)
        }
        this.$set(this.contextMenuPosition, 'left', event.clientX + 5)
      })
      this.currentNodeDom = event.target
      this.$set(this, 'currentActiveNode', nodeObj)
      this.$refs.tree.setCurrentNode(nodeObj)
      // console.log('当前操作节点DOM:', event.target)
      // console.log('当前操作节点数据:', nodeObj)
    },
    // 3、鼠标右键操作反馈
    handleContextMenuOperate(type) {
      switch (type) {
        case 'createCatalogue': this.handleCreateCatalogue(); break
        case 'rename': this.handleRename(); break
        case 'delete': this.handleDelete(); break
      }
    },
    // 4、返回上级目录
    handlePrevCatalogue() {
      let matchIndex = this.treeTopInfo.levelList.findIndex(item => item === this.currentLevel)
      if (matchIndex !== this.treeTopInfo.levelList.length - 1) {
        this.currentLevel = this.treeTopInfo.levelList[matchIndex + 1]
      }
      this.getFileDir()
    },
    // 5、返回下级目录
    handleNextCatalogue() {
      let matchIndex = this.treeTopInfo.levelList.findIndex(item => item === this.currentLevel)
      if (matchIndex !== 0) {
        this.currentLevel = this.treeTopInfo.levelList[matchIndex - 1]
      }
      this.getFileDir()
    },
    // 三、目录相关
    // ⭐(一) 新建
    // 1、递归遍历删除目录
    recursiveTraversalDelete(arr) {
      arr.forEach((item, index) => {
        if (item.id === 'CC') {
          arr.splice(index, 1)
          return
        } else {
          item.children && this.recursiveTraversalDelete(item.children)
        }
      })
    },
    // 2、递归遍历增加目录
    recursiveTraversalCreate(arr) {
      arr.forEach(item => {
        if (item.id === this.currentActiveNode.id) {
          let childCatalogue = {
            name: '',
            id: 'CC',
            parentPathId: this.currentActiveNode.id,
          }
          if (!item.children) { item.children = [] }
          item.children.push(childCatalogue)
          return
        } else {
          item.children && this.recursiveTraversalCreate(item.children)
        }
      })
    },
    // 3、新增界面显示
    handleCreateCatalogue() {
      this.recursiveTraversalDelete(this.fileTreeData)
      this.recursiveTraversalCreate(this.fileTreeData)
      // 显示当前新增框
      this.createCatalogueName = ''
      this.showCreateCatalogue = true
      this.$nextTick(() => {
        this.$refs.createCatalogueInput && this.$refs.createCatalogueInput.focus()
      })
    },
    // 4、确认||取消 新增
    handleCreateCatalogueBlur() {
      if (this.createCatalogueName === '') {
        this.showCreateCatalogue = false
        this.recursiveTraversalDelete(this.fileTreeData)
      } else {
        let params = {
          name: this.createCatalogueName,
          projectSetId: this.currentActiveNode.projectSetId || '',
          projectId: this.currentActiveNode.projectId || '',
          type: this.currentActiveNode.projectId ? '2' : '1',
          parentId: this.currentActiveNode.id
        }
        fileDirAdd(params).then(res => {
          res.code === 200 ? this.$message.success('新增目录成功') : this.$message.error('新增目录失败')
          this.getFileDir()
          this.showCreateProject = false
          this.createChildProjectName = ''
        })
      }
    },
    // ⭐(二) 重命名
    // 1、重命名 界面显示
    handleRename() {
      this.showRename = true
      this.reName = this.currentActiveNode.name
      this.$nextTick(() => { this.$refs.renameInput && this.$refs.renameInput.focus() })
    },
    // 2、确认||取消 重命名
    handleRenameBlur() {
      if (this.reName === this.currentActiveNode.name || this.reName === '') {
        this.showRename = false
      } else {
        let params = {
          dirId: this.currentActiveNode.id,
          dirName: this.reName,
        }
        fileDirRename(params).then(res => {
          this.$message.success('目录重命名成功！')
          this.getFileDir()
          this.showRename = false
        }).catch(() => { this.showRename = false })
      }
    },
    // ⭐(三) 删除
    handleDelete() {
      let deleteTip = `删除后 " ${this.currentActiveNode.name} " 及其下目录和文件将无法进行恢复！`
      // if (this.currentActiveNode.id === this.currentActiveNode.projectSetId || this.currentActiveNode.id === this.currentActiveNode.projectId) return this.$message.warning('顶级目录不可删除')
      this.$confirm(deleteTip, '是否确实要删除？', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
        let params = { dirId: this.currentActiveNode.id }
        fileDirDelete(params).then(res => {
          res.code === 200 ? this.$message.success('删除目录成功！') : this.$message.error('删除目录失败！')
          this.getFileDir()
        })
      }).catch(() => { })
    },
    // 四、文件相关
    // ⭐(一) 文件上传
    // 1、上传文件
    handleUploadFile() {
      this.$set(this.fileUploadDialog, 'visible', true)
    },
    // 2、文件上传成功
    handleUploadSuccess() {
      this.$set(this.fileUploadDialog, 'visible', false)
      this.getFile()
    },
    // ⭐(二) 文件下载
    // 1、表格选择
    handleSelectionChange(val) {
      // this.multipleSelection = val;
      this.$set(this, 'tableSelect', val)
    },
    // 1、文件预览
    handleFilePreview(rowItem) {
      // this.xDialog.visible = true
      let params = { filename: rowItem.filePath + rowItem.fileName }
      this.$loading({ text: '文件加载中', spinner: 'el-icon-loading', })
      singleFileDownload(params).then(res => {
        this.$loading().close()
        this.$previewFile(res, rowItem.fileName, '_blank')
        // this.$previewFile(res, rowItem.fileName, '_self')
      }).catch(() => { this.$loading().close() })
    },
    // 2、文件下载
    handleDownloadFile() {
      if (this.tableSelect.length === 0) return this.$message.warning('请选择要下载的文件！')
      if (this.tableSelect.length === 1) {
        let params = { filename: this.tableSelect[0].filePath + this.tableSelect[0].fileName }
        singleFileDownload(params).then(res => {
          // console.log('%c【API D⭐】描述：单文件下载', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：', 'color:#F0F;font-size:12px;font-weight:700;')
          // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
          // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
          if (res) {
            const url = window.URL.createObjectURL(new Blob([res]))
            const link = document.createElement('a')
            link.href = url
            link.download = this.tableSelect[0].fileName
            link.click()
            URL.revokeObjectURL(url)
            this.$message.success('下载文件成功！')
          }
        })
      }
      if (this.tableSelect.length > 1) {
        let filePaths = []
        this.tableSelect.forEach(item => {
          filePaths.push(item.filePath + item.fileName)
        })
        let params = { filePaths: filePaths }
        multipleFileDownload(params).then(res => {
          // console.log('%c【API D⭐】描述：多文件下载', 'color:#FF0;font-size:14px;font-weight:700;font-family:KaiTi;padding:0 15px;background-color:#FF1493;')
          // console.log('%c【API I⭐】接口：', 'color:#F0F;font-size:12px;font-weight:700;')
          // console.log('%c【API P⭐】参数：', 'color:#0078D7;font-weight:700;', params)
          // console.log('%c【API R⭐】结果：', 'color:#00C957;font-weight:700;', res)
          if (res) {
            const url = URL.createObjectURL(new Blob([res]))
            const link = document.createElement('a')
            link.href = url
            link.download = '多文件下载.zip'
            link.click()
            URL.revokeObjectURL(url)
            this.$message.success('下载文件成功！')
          }
        })
      }

    },
    // ⭐(三) 文件重命名
    handleRenameFile(rowItem) {
      this.$prompt('请填写新的文件名', '文件重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'c-message-prompt',
        inputPattern: /^[^\\/?%*:|"<>\.]+(\.[^\\/?%*:|"<>\.]+)+$/,
        inputErrorMessage: '文件名格式不正确',
        inputPlaceholder: '请输入文件名',
        inputValue: rowItem.fileName,
        inputValidator: (val) => { if (!val) { return '文件名不能为空' } },
      }).then(({ value }) => {
        let params = { fileId: rowItem.id, fileName: value, }
        fileRename(params).then(res => {
          if (res.data === '文件已存在') {
            this.$message.warning('该文件名已存在')
          } else {
            this.$message.success('文件重命名成功！')
            this.getFile()
          }
        })
      }).catch(() => { })
    },
    // ⭐(四) 文件删除
    handleDeleteFile(rowItem) {
      let deleteTip = `删除后文件将无法进行恢复！`
      this.$confirm(deleteTip, '是否确实要删除？', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass: 'c-message-confirm' }).then(() => {
        let params = { fileId: rowItem.id }
        fileDelete(params).then(res => {
          this.$message.success('删除文件成功！')
          this.getFile()
        })
      }).catch(() => { })
    },
  },
}
</script>

<style lang="scss" scoped>
.file-operate-container {
  width: 100%;
  height: 100%;
  background-color: #efefef;

  .card-header {
    width: 100%;
    height: 60px;
    background: #f9f9f9;
    border-bottom: 1px solid #dedede;
    display: flex;
    align-items: center;
    padding: 0 20px;

    .header-title {
      overflow: hidden;
      width: 0;
      flex: 1;
      color: #333;
      font-size: 16px;
      font-weight: 700;
      font-family: PingFang SC, PingFang SC;
      white-space: nowrap;
      display: flex;
      align-items: center;
    }

    .header-operate {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      height: 100%;
    }
  }

  .card-content {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;

    .left-tree {
      width: 250px;
      height: 100%;
      flex-shrink: 0;
    }

    ::v-deep .el-tree {
      height: calc(100% - 0px) !important;
      padding: 10px;
      // min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #efefef;
      border-right: 1px solid #c9c9c9;

      // 滚动条大小
      &::-webkit-scrollbar {
        display: block !important;
        width: 4px !important;
        height: 4px !important;
      }

      // 滚动条轨道
      &::-webkit-scrollbar-track {
        border-radius: 10px;
        background-color: #efefef;
      }

      // 滚动条滑块
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: var(--themeColor);
      }

      // 滚动条右下角
      &::-webkit-scrollbar-corner {
        background: transparent;
      }

      .el-tree-node {
        padding: 2px 0;

        .el-tree-node__content {
          &:hover {
            background-color: #eefaf4;
          }

          &:has(> .tree-row[class*="active"]) {
            border: 1px solid var(--themeColor);
          }
        }

        &:focus>.el-tree-node__content {
          background-color: #eefaf4;
        }

        &[class*="is-current"] {
          &>.el-tree-node__content {
            background-color: var(--themeColor);
            color: #fff;
            font-weight: 700;
          }
        }
      }

      .tree-row {
        display: flex;
        align-items: center;
        width: 100%;
        height: 20px;
        padding-right: 10px;
      }

      .real-name {
        flex: 1;
        width: 100%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .is-expanded,
      .is-current,
      .is-focusable {
        background-color: transparent;
      }

      .el-icon-caret-right {
        display: none;
      }

      .left-tree-icon {
        width: 16px;
        display: inline-block;
        font-size: 12px;
        margin-left: 5px;
        margin-right: 5px;
      }

      .file-close-svg {
        font-size: 16px;
      }

      .create-part {
        height: 24px;

        .el-input {
          height: 100% !important;

          .el-input__inner {
            height: 100% !important;
            font-size: 14px;
            border: 1px solid var(--themeColor);
          }
        }
      }

      .rename-part {
        height: 24px;

        .el-input {
          height: 100% !important;

          .el-input__inner {
            height: 100% !important;
            font-size: 14px;
            border: 0;
            background: transparent;
          }
        }
      }
    }

    .right-table {
      flex: 1;
      flex-shrink: 0;
      height: 100%;
      padding: 10px 20px;

      .search {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        margin-bottom: 10px;
        min-width: 400px;

        .el-input {
          min-width: 200px;
          max-width: 400px;
          flex: 1;
          flex-shrink: 0;
        }

        ::v-deep .el-button {
          flex-shrink: 0;

          .search-svg {
            font-size: 16px;
          }
        }
      }

      ::v-deep .el-table {
        min-width: 400px;

        .file-preview-text {
          cursor: pointer;

          &:hover {
            color: #0097e3;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>