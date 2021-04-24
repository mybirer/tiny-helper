/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2021 M. Yasin Birer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

class TinymceHelper {
    editorId = '';
    defaults = {
        image_url_prefix: '',
        image_upload_url: '',
        language: 'en',
        content_css: '/packages/mybirer_tiny-helper/css/inline.css'
    }

    constructor(){}

    setOptions = function(options){
        this.defaults = {
            ...this.defaults,
            ...options
        };

        if(options && options.tiny_cloud_token && options.tiny_cloud_token.length>0){
            this.setTinyCloudToken(options.tiny_cloud_token);
        }
    }

    deferFn = function(method,fn) {
        var self = this;
        if (fn()) {
            method();
        } else {
            setTimeout(function() { self.deferFn(method,fn) }, 50);
        }
    }

    setTinyCloudToken = function(token){
        if(!token || token.length === 0){
            throw new Error('Please provide valid token');
        }
        let s=document.createElement('script')
        s.setAttribute("type","text/javascript")
        s.setAttribute("src", `https://cdn.tiny.cloud/1/${token}/tinymce/5/tinymce.min.js`)
        document.getElementsByTagName("head")[0].appendChild(s);
        console.log('flag 2 babili');
    }

    construct = function(editorId, params = {}, initCb = ()=>{}) {
        this.deferFn(()=>{
            var __self = this;

            var elemId = '#'+editorId;
            if($(elemId).length===0){
                console.warn('Invalid editor id provided for tinymce construct');
                return;
            }
            if(this.isEditorUsable(editorId)){
                console.log("Editor: " + editorId + " already initialized. Only init callback running if it is defined");
                var editor = this.getEditor(editorId);
                if(typeof initCb === 'function' && editor){
                    initCb(editor);
                }
                return editor;
            }
            this.removeEditor(editorId);
            var editor = tinymce.init({
                selector: elemId,
                plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                imagetools_cors_hosts: ['picsum.photos'],
                menubar: 'file edit view insert format tools table help',
                toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                toolbar_sticky: true,
                autosave_ask_before_unload: true,
                autosave_interval: '30s',
                autosave_prefix: '{path}{query}-{id}-',
                autosave_restore_when_empty: false,
                autosave_retention: '2m',
                image_advtab: true,
                images_upload_handler: function (blobInfo, success, failure) {
                    var xhr, formData;
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', __self.defaults.image_upload_url);
                    xhr.onload = function () {
                        var json;
                        if (xhr.status != 200) {
                            failure('HTTP Error: ' + xhr.status);
                            return;
                        }
                        json = JSON.parse(xhr.responseText);
        
                        if (!json || typeof json.location != 'string') {
                            failure('Invalid JSON: ' + xhr.responseText);
                            return;
                        }
                        success(__self.getPictureWithLink(json.location.replace('img/', '')));
                    };
                    formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    xhr.send(formData);
                },
                content_css: __self.content_css,
                importcss_append: true,
                height: params && params.height || 400,
                file_picker_callback: function (callback, value, meta) {
                    /* Provide file and text for the link dialog */
                    if (meta.filetype === 'file') {
                        callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
                    }
        
                    /* Provide image and alt text for the image dialog */
                    if (meta.filetype === 'image') {
                        callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
                    }
        
                    /* Provide alternative source and posted for the media dialog */
                    if (meta.filetype === 'media') {
                        callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
                    }
                },
                templates: [],
                codesample_dialog_width: 600,
                codesample_dialog_height: 425,
                template_popup_width: 600,
                template_popup_height: 450,
                powerpaste_allow_local_images: true,
                template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                image_caption: true,
                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                noneditable_noneditable_class: 'mceNonEditable',
                toolbar_mode: 'sliding',
                contextmenu: 'link image imagetools table',
                cleanup_on_startup: false,
                trim_span_elements: false,
                verify_html: true,
                cleanup: false,
                convert_urls: false,
                language: __self.defaults.language,
                language_url : __self.getLanguageUrl(),
                init_instance_callback: function (editor) {
                    console.log('Editor: ' + editor.id + ' is now initialized.');
                    if(typeof initCb === 'function'){
                        initCb(editor);
                    }
                },
                onchange_callback: function (params) {
                    console.log('onchange_callback', params);
                },
                setup: function (ed) {
                    ed.on('change', function (e) {
                        if (typeof tinymceOnChangeCallback !== 'undefined') {
                            tinymceOnChangeCallback(e, ed);
                        }
                    });
                },
                fontsize_formats: '8px 8.5px 9px 9.5px 10px 10.5px 11px 11.5px 12px 12.5px 13px 13.5px 14px 14.5px 15px 15.5px 16px 20px 24px 28px 32px 36px 40px 50px 60px 72px 80px 90px 100px 120px 150px 200px 300px 400px 500px',
            });
            return editor;
        },()=>typeof tinyMCE !== 'undefined');
    }
    
    
    resetAll = function() {
        if(!tinyMCE){
            return null;
        }
        //tinymce.remove();
        for (var i = tinymce.editors.length - 1 ; i > -1 ; i--) {
            var ed_id = tinymce.editors[i].id;
            tinyMCE.execCommand("mceRemoveEditor", true, ed_id);
        }
        tinymce.EditorManager.editors = [];
    }
    
    isEditorUsable = function (editorId) {
        if(!tinyMCE){
            return null;
        }
        var editor = this.getEditor(editorId);
        if(editor){
            return $('#'+editorId).parent().find('.tox-tinymce.tox').length > 0;
        }
        return false;
    }
    
    removeEditor = function(editorId){
        if(!tinyMCE){
            return null;
        }
        var editor = this.getEditor(editorId);
        if(editor){
            try{
                editor.remove();
            }
            catch(exception){
                toastr.error('HTML Editor işlemlerinde bir hata oluştu! Lütfen sayfayı yenileyip tekrar deneyiniz aksi taktirde veri kaybınız olabilir!');
                console.log(exception);
            }
        }
    }
    
    getContentOfEditor = function (editorId) {
        if(!tinyMCE){
            return null;
        }
        var editor = this.getEditor(editorId);
        if(editor){
            return editor.getContent();
        }
        return "";
    }
    
    getEditor = function (editorId) {
        if(!tinyMCE){
            return null;
        }
        var editors = tinyMCE.get();
        if(!editors || editors.length === 0){
            return null;
        }
        for(var editor of editors){
            if(editor.targetElm.id===editorId){
                return editor
            }
        }
        return null;
    }


    getPictureWithLink = function(filename) {
        if (filename && filename.length > 0) {
            return this.defaults.image_url_prefix+'/'.replace(/\/\//ig,'/') + filename;
        }
        return 'about:blank';
    }

    getLanguageUrl = function(){
        if(!tinyMCE){
            return null;
        }
        var availableLanguages = ['tr','es_MX'];
        if(availableLanguages.indexOf(this.defaults.language)>-1){
            return '/packages/mybirer_tiny-helper/lang/'+this.defaults.language+'.js';
        }
        return '';
    }
}

TinyHelper = new TinymceHelper();