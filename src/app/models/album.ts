export class Album{
	constructor(
		public _id: string,
		public title: string,
		public year: number,
		public image: string,
		public description: string,
		public genre: string,
		public artist: string
	){
		
	}
}