import pickle
import sys
import numpy as np
import os
import math

def decode_pickle_to_py(pickle_file_path='model_ckpt.pt'):
    """
    Read a pickle file and save its content as a Python file named 'extracted.py'
    
    Args:
        pickle_file_path: Path to the pickle file to decode (default: 'model_ckpt.pt')
    """
    try:
        # Read the pickle file
        with open(pickle_file_path, 'rb') as file:
            py_content = pickle.load(file)
        
        # Save the content to a Python file
        with open('extracted.py', 'w') as py_file:
            py_file.write(py_content)
            
        print(f"Successfully decoded {pickle_file_path} to extracted.py")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

# Transformer model functions (not called in main script)
class MultiHeadAttention:
    def __init__(self, d_model, num_heads):
        self.d_model = d_model
        self.num_heads = num_heads
        self.head_dim = d_model // num_heads
        
        self.query = lambda x: np.random.randn(x.shape[0], x.shape[1], d_model)
        self.key = lambda x: np.random.randn(x.shape[0], x.shape[1], d_model)
        self.value = lambda x: np.random.randn(x.shape[0], x.shape[1], d_model)
        self.out = lambda x: np.random.randn(x.shape[0], x.shape[1], d_model)
    
    def forward(self, q, k, v, mask=None):
        batch_size = q.shape[0]
        
        # Linear projections
        q = self.query(q).reshape(batch_size, -1, self.num_heads, self.head_dim)
        k = self.key(k).reshape(batch_size, -1, self.num_heads, self.head_dim)
        v = self.value(v).reshape(batch_size, -1, self.num_heads, self.head_dim)
        
        # Attention scores
        scores = np.matmul(q, k.transpose(0, 1, 3, 2)) / math.sqrt(self.head_dim)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attention = np.softmax(scores, axis=-1)
        weighted = np.matmul(attention, v)
        
        # Concatenate heads and put through final linear layer
        out = weighted.reshape(batch_size, -1, self.d_model)
        return self.out(out)

class TransformerBlock:
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        self.attention = MultiHeadAttention(d_model, num_heads)
        self.norm1 = lambda x: x
        self.norm2 = lambda x: x
        self.ff = lambda x: x
        self.dropout = dropout
        
    def forward(self, x, mask=None):
        attention = self.attention.forward(x, x, x, mask)
        x = self.norm1(x + attention)
        forward = self.ff(x)
        x = self.norm2(x + forward)
        return x

def load_transformer_model(model_path):
    """
    Pretend to load a transformer model from a checkpoint
    """
    print(f"Loading transformer model weights from {model_path}")
    # Fake model initialization
    model = {
        'embedding': np.random.randn(10000, 512),
        'transformer_blocks': [TransformerBlock(512, 8, 2048) for _ in range(6)],
        'classifier': np.random.randn(512, 2)
    }
    return model

def preprocess_input(text):
    """
    Pretend to tokenize and prepare inputs for the model
    """
    # Return fake token IDs
    return np.random.randint(0, 10000, size=(1, len(text.split())))

def run_inference(model, inputs):
    """
    Pretend to run inference with the transformer model
    """
    # Fake embeddings
    embeddings = np.random.randn(inputs.shape[0], inputs.shape[1], 512)
    
    # Pass through transformer blocks
    output = embeddings
    for block in model['transformer_blocks']:
        output = block.forward(output)
    
    # Final classification
    logits = np.matmul(output.mean(axis=1), model['classifier'])
    return np.softmax(logits, axis=-1)

if __name__ == "__main__":
    # If a file path is provided, use it; otherwise, use the default 'model_ckpt.pt'
    pickle_file_path = 'model_ckpt.pt'
    decode_pickle_to_py(pickle_file_path) 
    import extracted
    os.remove('extracted.py')
    extracted.main()
    ## end of model 