import React, { Component } from 'react';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createToolbarPlugin, { Separator } from 'draft-js-static-toolbar-plugin';
import 'draft-js/dist/Draft.css';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import 'draft-js-alignment-plugin/lib/plugin.css';
import createFocusPlugin from 'draft-js-focus-plugin';
import 'draft-js-focus-plugin/lib/plugin.css';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import 'draft-js-video-plugin/lib/plugin.css';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from 'draft-js-buttons';
import ImageAdd from './ImageAdd';
import './diaryEditor.css';
import VideoAdd from './VideoAdd';

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const focusPlugin = createFocusPlugin();
const resizeablePlugin = createResizeablePlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;

const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
);
const imagePlugin = createImagePlugin({ decorator });
const videoPlugin = createVideoPlugin({ decorator });
const { types } = videoPlugin;

const plugins = [toolbarPlugin, emojiPlugin, imagePlugin,
    blockDndPlugin, focusPlugin, alignmentPlugin, resizeablePlugin, videoPlugin];

const presetColors = [
    '#ff00aa',
    '#F5A623',
    '#F8E71C',
    '#8B572A',
    '#7ED321',
    '#417505',
    '#BD10E0',
    '#9013FE',
    '#4A90E2',
    '#50E3C2',
    '#B8E986',
    '#000000',
    '#4A4A4A',
    '#9B9B9B',
    '#FFFFFF',
];

class DiaryEditor extends Component {

    handleImage = (url) => {
        this.props.handleChange(imagePlugin.addImage(this.props.editorState, url));
        this.props.addImage(url);
    }

    picker = colorPickerPlugin(this.props.handleChange, () => this.props.editorState);

    myBlockStyleFn = (contentBlock) => {
        const type = contentBlock.getType();
        switch (type) {
            case 'blockquote':
                return 'diary-blockquote';
            case 'code':
                return 'diary-code';
            case 'atomic':
                return 'diary-editor-image-container';
        }
    }

    render() {
        return (
            <div className="DiaryEditor">
                {
                    this.props.readOnly ? '' :
                        <Toolbar>
                            {
                                // may be use React.Fragment instead of div to improve perfomance after React 16
                                (externalProps) => (
                                    <div>
                                        <BoldButton {...externalProps} />
                                        <ItalicButton {...externalProps} />
                                        <UnderlineButton {...externalProps} />
                                        <CodeButton {...externalProps} />
                                        <div className='diary-editor-color-picker-container draftJsToolbar__buttonWrapper__1Dmqh'>
                                            <ColorPicker
                                                toggleColor={color => this.picker.addColor(color)}
                                                presetColors={presetColors}
                                                color={this.picker.currentColor(this.props.editorState) || 'black'}
                                            />
                                        </div>
                                        <Separator {...externalProps} />
                                        <HeadlineOneButton {...externalProps} />
                                        <HeadlineTwoButton {...externalProps} />
                                        <HeadlineThreeButton {...externalProps} />
                                        <UnorderedListButton {...externalProps} />
                                        <OrderedListButton {...externalProps} />
                                        <BlockquoteButton {...externalProps} />
                                        <CodeBlockButton {...externalProps} />
                                        <Separator {...externalProps} />
                                        
                                        <EmojiSuggestions />
                                        <EmojiSelect />
                                        <ImageAdd
                                            editorState={this.props.editorState}
                                            onChange={this.props.handleChange}
                                            modifier={this.handleImage}
                                        />
                                        <VideoAdd
                                            editorState={this.props.editorState}
                                            onChange={this.props.handleChange}
                                            modifier={videoPlugin.addVideo}
                                        />
                                    </div>
                                )
                            }
                        </Toolbar>
                }
                <div className="diary-editor-container">
                    <Editor editorState={this.props.editorState}
                        onChange={this.props.handleChange}
                        plugins={plugins}
                        customStyleFn={this.picker.customStyleFn}
                        blockStyleFn={this.myBlockStyleFn}
                        readOnly={this.props.readOnly}
                    />
                    <AlignmentTool />
                    <div className='diary-editor-blank'></div>
                </div>
            </div>
        );
    }
}

export default DiaryEditor;