import Foundation
import Vision
import AppKit

func recognizeText(imagePath: String) {
    guard let image = NSImage(contentsOfFile: imagePath),
          let tiffData = image.tiffRepresentation,
          let cgImageSource = CGImageSourceCreateWithData(tiffData as CFData, nil),
          let cgImage = CGImageSourceCreateImageAtIndex(cgImageSource, 0, nil) else {
        print("Failed to load image")
        return
    }
    
    let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    let request = VNRecognizeTextRequest { (request, error) in
        if let error = error {
            print("Error: \(error)")
            return
        }
        guard let observations = request.results as? [VNRecognizedTextObservation] else {
            print("No results")
            return
        }
        for observation in observations {
            guard let topCandidate = observation.topCandidates(1).first else { continue }
            print("Text: \(topCandidate.string) (Confidence: \(topCandidate.confidence))")
        }
    }
    
    request.recognitionLevel = .accurate
    do {
        try requestHandler.perform([request])
    } catch {
        print("Failed to perform OCR: \(error)")
    }
}

let args = CommandLine.arguments
if args.count > 1 {
    recognizeText(imagePath: args[1])
} else {
    recognizeText(imagePath: "logo.png")
}
