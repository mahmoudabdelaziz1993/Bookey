FilePond.registerPlugin(FilePondPluginFileEncode,FilePondPluginImagePreview,FilePondPluginImageResize,FilePondPluginImageCrop,FilePondPluginImageResize);
document.addEventListener('FilePond:pluginloaded', e => {
    console.log('FilePond plugin is ready for use', e.detail);
});
FilePond.setOptions({
    required:true,
    stylePanelAspectRatio:150 / 100 ,
    imageResizeTargetWidth:100,
    imageResizeTargetHeight:150
})
//The parse method lets us automatically load FilePond elements on the page.This will look for elements with the class .filepond
FilePond.parse(document.body);
