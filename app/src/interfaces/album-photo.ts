export default interface iAlbumFile {
    albumFileID: number;
    albumFileName: string;
    albumFileType: string;
    albumFileSize: number;
    albumID: number;
    createBy: number;
    createDate: Date;
    updateBy: number;
    updateDate: Date;
    isDeleted: number;
    isVisible: number;
    albumFileUpload: string;
}
  