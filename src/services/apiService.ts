import axios from 'axios'

const API_URL = 'http://localhost:5004'

interface ImageResult {
  image_path: string
  distance: number
}

export default {
  async findSimilarImages(formData: FormData): Promise<ImageResult[]> {
    try {
      const response = await axios.post(`${API_URL}/find_similar_images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.results
    } catch (error) {
      console.error('Error fetching similar images:', error)
      throw error
    }
  },

  async getImageByPath(imagePath: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${API_URL}/get_image_by_path?image_path=${encodeURIComponent(imagePath)}`,
      )
      const blob = await response.blob()
      return blob
    } catch (error) {
      console.error('Error fetching image from URL:', error)
      throw error
    }
  },
}
