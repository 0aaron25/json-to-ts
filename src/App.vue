<template>
  <el-container class="container">
    <el-header>
      <h2>JSON to TS Type Generator</h2>
    </el-header>
    <el-main>
      <el-form>
        <el-form-item>
          <el-input
            v-model="interfaceName"
            placeholder="Enter interface name (optional)"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="jsonInput"
            type="textarea"
            :rows="10"
            placeholder="Paste your JSON here..."
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generateType"
            >Generate TS Type</el-button
          >
          <el-button type="success" @click="copyOutput" v-if="output"
            >Copy</el-button
          >
          <el-button
            type="danger"
            @click="clearAll"
            v-if="jsonInput || interfaceName"
            >Clear</el-button
          >
        </el-form-item>
      </el-form>
      <el-card v-if="output" class="output-card">
        <pre>{{ output }}</pre>
      </el-card>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import "element-plus/es/components/message/style/css";
import { generateTSType, parseInput } from "@/utils/typeGenerator";

const interfaceName = ref("");
const jsonInput = ref("");
const output = ref("");

function generateType() {
  try {
    if (!jsonInput.value) {
      ElMessage.error("Please enter JSON data");
      return;
    }
    const inputData = parseInput(jsonInput.value);
    const customInterfaceName = interfaceName.value.trim() || "RootType";
    output.value = generateTSType(inputData, customInterfaceName);
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(`Error: ${error.message}`);
    } else {
      ElMessage.error("An unknown error occurred");
    }
  }
}

function copyOutput() {
  navigator.clipboard
    .writeText(output.value)
    .then(() => ElMessage.success("Copied to clipboard!"))
    .catch((err) => {
      console.error("Failed to copy: ", err);
      ElMessage.error("Failed to copy to clipboard");
    });
}

function clearAll() {
  interfaceName.value = "";
  jsonInput.value = "";
  output.value = "";
}
</script>

<style>
.container,
#app {
  min-width: 500px;
  max-width: 800px;
  margin: 0 auto;
}

.el-header {
  text-align: center;
  line-height: 60px;
}

.output-card {
  margin-top: 20px;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
