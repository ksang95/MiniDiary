import React, { Component } from 'react';

class ImageAdd extends Component {
    handleChange = (e)=>{
        // console.log(e.target.files[0])

        //upload 하기!
        //url: "/api/post/new-post/resource", // server url
        //     method: "POST", // change query method, default 'POST'
        //     name: 'images', // 아래 설정으로 image upload form의 key 값을 변경할 수 있다.
        //     callbackOK: (serverResponse) => { // 성공하면 리턴되는 함수
        //         this.addImage(serverResponse.fileURL);
        //          this.props.modifier(this.props.editorState, serverResponse.fileURL) 
        //     },

    }

    render() {
        return (
            <div>
                <input type="file" name="file" onChange={this.handleChange}/>
            </div>
        );
    }
}

export default ImageAdd;