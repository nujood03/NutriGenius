import pickle
import sys

def encode_py_to_pickle(python_file_path):
    """
    Read a Python file as text and save it as a pickle file named 'model_ckpt.pt'
    
    Args:
        python_file_path: Path to the Python file to encode
    """
    try:
        # Read the Python file as text
        with open(python_file_path, 'r') as file:
            py_content = file.read()
        
        # Save the text content to a pickle file
        with open('model_ckpt.pt', 'wb') as pickle_file:
            pickle.dump(py_content, pickle_file)
            
        print(f"Successfully encoded {python_file_path} to model_ckpt.pt")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python pickle_encoder.py <python_file_path>")
        sys.exit(1)
    
    python_file_path = sys.argv[1]
    encode_py_to_pickle(python_file_path) 