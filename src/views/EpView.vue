<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const scripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://cdn.jsdelivr.net/gh/yargrinders/EPA@main/js/xlsx-patch.js',
  'https://cdn.jsdelivr.net/gh/yargrinders/EPA@main/js/pdf-fields.js',
  'https://cdn.jsdelivr.net/gh/yargrinders/EPA@main/js/pdf-edit.js',
  'https://cdn.jsdelivr.net/gh/yargrinders/EPA@main/js/main.js',
]
const loaded = []
let originalFetch

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = () => reject(new Error(`Script konnte nicht geladen werden: ${src}`))
    document.body.appendChild(script)
    loaded.push(script)
  })
}

onMounted(async () => {
  window.EPA_CDN_BASE = 'https://cdn.jsdelivr.net/gh/yargrinders/EPA@main/'
  window.SETTINGS = {
    pdf: { include: false, editChangedFields: true },
    excel: { aufmass: true, material: true },
    archive: { autoDownload: true, compression: 'DEFLATE' },
    ui: { showLoader: true, debug: false },
  }
  originalFetch = window.fetch.bind(window)
  window.fetch = (input, init) => {
    if (typeof input === 'string' && (input.startsWith('json/') || input.startsWith('files/'))) {
      return originalFetch(window.EPA_CDN_BASE + input, init)
    }
    return originalFetch(input, init)
  }
  for (const src of scripts) await loadScript(src)
})

onBeforeUnmount(() => {
  loaded.forEach(script => script.remove())
  if (originalFetch) window.fetch = originalFetch
})
</script>

<template>
  <section class="sheet epa" aria-label="Einblas-Protokoll Generator">
    <div class="epa__hero">
      <div class="epa__mark">EP</div>
      <div><span class="eyebrow">PDF → Excel</span><h2>Einblas-Protokoll verarbeiten</h2><p>PDF laden, erkannte Daten prüfen, Aufmaß und Materialliste als ZIP herunterladen.</p></div>
    </div>
    <section id="dropzone" class="epa-drop"><input id="fileInput" type="file" accept="application/pdf" hidden><i class="ti ti-file-upload" /><p class="epa-drop__title">Einblas-Protokoll PDF hier ablegen</p><p class="epa-drop__hint">oder klicken zum Auswählen</p></section>
    <p id="error" class="epa-error" hidden />
    <section id="editor" class="epa-editor" hidden><div class="epa-editor__top"><div><span class="eyebrow">Editor</span><h3>Erkannte Felder</h3></div><p>Quelle: <span id="sourceName" /></p></div><p>Wenn Plumett falsch ausgefüllt wurde, hier korrigieren.</p><div id="fields" class="epa-fields fields" /><div class="epa-editor__actions"><button id="resetBtn" class="epa-btn epa-btn--ghost">Andere Datei</button><button id="generateBtn" class="epa-btn epa-btn--primary">Archiv erstellen</button></div></section>
    <section id="result" class="epa-result" hidden><div class="epa-result__icon"><i class="ti ti-check" /></div><p class="epa-result__title">Fertig.</p><a id="downloadLink" class="epa-btn epa-btn--primary" download>Download</a><button id="againBtn" class="epa-btn epa-btn--ghost">Neues Protokoll</button></section>
  </section>
  <Teleport to="body"><div id="loader" class="epa-loader" hidden><div class="epa-loader__box"><p class="epa-loader__title">Archiv wird erstellt…</p><ol id="steps" class="epa-steps" /><div class="epa-progress"><div id="progressBar" class="epa-progress__bar" /></div><p id="progressText" class="epa-progress__text">0%</p></div></div></Teleport>
</template>
