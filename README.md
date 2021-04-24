# Tinymce Helper

Tinymce 5 editor module for meteor.

### Installation

Add package into tour meteor project.

```sh
$ meteor add mybirer:tiny-helper
```

Put this snippet into client/main.js
```js
Meteor.startup(function() {
	TinyHelper.setOptions({
		tiny_cloud_token: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', //tinymce cloud token. this is required to initialization
		image_url_prefix: 'http://example.com/images/',
		image_upload_url: 'http://example.com/images/inline-uploader.php',
		language:'en'
	});
});
```

#### Usage

Create html template
```html
<template name="tinyhelpersample">
    <textarea id="tinyhelper-element"></textarea>
</template>
```

Construct helper target id. Please note that don't provide # before element id
```js
Template.tinyhelpersample.onRendered(function(){
    TinyHelper.construct("tinyhelper-element",{},function(editor){
        console.log(editor.id);
    });
});
```

You can get content of editor inside of events.
```js
Template.tinyhelpersample.events({
    'click .get-btn':function(){
        var content = TinyHelper.getContentOfEditor("addPostFormContent");
        alert(content);
        //do whatever with this content. eg: save to db...
        
    }
})
```

### Methods

TinyHelper has these methods

| Method | Arguments | Description |
| ------ | ------ | ------ |
| setOptions | options:object | Helps to define options of Tinymce Editor
| construct | editorId:string, params:object, afterInitCallback:function| Constructs Tinymce Editor
| resetAll | - | Removes all tinymce editors in the document
| removeEditor | editorId:string | Removes single tinymce editor in the document according to provided editor id
| isEditorUsable | editorId:string | Returns is editor usable or not according to visibility and usability
| getContentOfEditor | editorId:string | Returns the content of editor in html format according to provided editor id
| getEditor | editorId:string | Return tinymce object of editor according to provided editor id

### Todos

 - Write tests
 - Extend options with tinymce options

License
----

MIT
